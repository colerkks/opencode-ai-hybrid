import * as path from "node:path";
import * as fs from "node:fs";
import { access, readFile, writeFile } from "node:fs/promises";
import { ProjectDetector } from "./ProjectDetector.js";

/**
 * Default skills configuration
 */
interface DefaultSkillsConfig {
  default_skills: string[];
  auto_apply_defaults: boolean;
  auto_reload: boolean;
}

/**
 * Auto-initialization for projects
 * - Detects project root
 * - Applies default skills
 * - Creates skills.lock.json if needed
 */
export class AutoInitializer {
  private projectRoot: string;
  private globalConfigPath: string;
  private skillsLockPath: string;

  constructor(projectPath: string) {
    this.projectRoot = ProjectDetector.findProjectRootSync(projectPath);
    this.globalConfigPath = path.join(
      process.env.HOME || "",
      ".config",
      "opencode",
      "hybrid-arch.json"
    );
    this.skillsLockPath = path.join(this.projectRoot, "skills.lock.json");
  }

  /**
   * Get project root
   */
  getProjectRoot(): string {
    return this.projectRoot;
  }

  /**
   * Load default skills from global config
   */
  async loadDefaultSkillsConfig(): Promise<DefaultSkillsConfig> {
    try {
      const content = await readFile(this.globalConfigPath, "utf-8");
      const config = JSON.parse(content);
      return {
        default_skills: config.default_skills || [],
        auto_apply_defaults: config.auto_apply_defaults ?? true,
        auto_reload: config.auto_reload ?? true,
      };
    } catch {
      // Fallback to hardcoded defaults
      return {
        default_skills: ["nextjs-docs-router", "nextjs-debug"],
        auto_apply_defaults: true,
        auto_reload: true,
      };
    }
  }

  /**
   * Check if skills.lock.json exists
   */
  async lockFileExists(): Promise<boolean> {
    try {
      await access(this.skillsLockPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Read current skills.lock.json
   */
  async readLockFile(): Promise<any> {
    try {
      const content = await readFile(this.skillsLockPath, "utf-8");
      return JSON.parse(content);
    } catch {
      return { skills: {} };
    }
  }

  /**
   * Apply default skills to project
   * - Creates lockfile if doesn't exist
   * - Fills empty lockfile with defaults
   * - Respects existing configuration
   */
  async applyDefaultSkills(): Promise<{
    action: "created" | "filled" | "skipped" | "disabled";
    skills: string[];
  }> {
    const config = await this.loadDefaultSkillsConfig();

    // Check if auto-apply is disabled
    if (!config.auto_apply_defaults) {
      return { action: "disabled", skills: [] };
    }

    const defaultSkills = config.default_skills;
    if (defaultSkills.length === 0) {
      return { action: "skipped", skills: [] };
    }

    const lockExists = await this.lockFileExists();

    if (!lockExists) {
      // Create new lockfile with defaults
      const lockContent = {
        version: "1.0.0",
        skills: Object.fromEntries(
          defaultSkills.map((name) => [name, { version: "*" }])
        ),
        metadata: {
          auto_generated: true,
          generated_at: new Date().toISOString(),
        },
      };

      await writeFile(
        this.skillsLockPath,
        JSON.stringify(lockContent, null, 2)
      );

      return { action: "created", skills: defaultSkills };
    }

    // Lockfile exists, check if empty
    const lockContent = await this.readLockFile();
    const hasSkills =
      lockContent.skills && Object.keys(lockContent.skills).length > 0;

    if (!hasSkills) {
      // Fill empty lockfile with defaults
      lockContent.skills = Object.fromEntries(
        defaultSkills.map((name) => [name, { version: "*" }])
      );
      lockContent.metadata = {
        ...(lockContent.metadata || {}),
        auto_filled: true,
        filled_at: new Date().toISOString(),
      };

      await writeFile(
        this.skillsLockPath,
        JSON.stringify(lockContent, null, 2)
      );

      return { action: "filled", skills: defaultSkills };
    }

    // Lockfile has content, respect it
    return { action: "skipped", skills: [] };
  }

  /**
   * Run full auto-initialization
   * - Detect project root
   * - Apply default skills
   * - Return status report
   */
  async initialize(): Promise<{
    projectRoot: string;
    projectType: string;
    lockFileAction: string;
    appliedSkills: string[];
    autoReload: boolean;
  }> {
    const projectType = ProjectDetector.detectProjectType(this.projectRoot);
    const config = await this.loadDefaultSkillsConfig();
    const result = await this.applyDefaultSkills();

    return {
      projectRoot: this.projectRoot,
      projectType,
      lockFileAction: result.action,
      appliedSkills: result.skills,
      autoReload: config.auto_reload,
    };
  }
}