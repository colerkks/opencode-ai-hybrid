import * as path from "node:path";
import * as os from "node:os";
import * as fsSync from "node:fs";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";

import type {
  ArchitectureState,
  GlobalLayerConfig,
  ProjectLayerConfig,
  LayerSource,
  SkillLockEntry,
  SkillLockFile,
  DiscoveredSkill,
} from "../types/index.js";

import { ensureArchCommands } from "../commands/index.js";

type InitProjectScaffoldOptions = {
  installBuiltinSkills: boolean;
  writeCommands: boolean;
  // Keep the type loose to avoid circular imports
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  skillManager: any;
};

export class ConfigManager {
  private readonly projectPath: string;
  private cachedState: ArchitectureState | null = null;

  private readonly globalConfigPath: string;
  private readonly globalAgentsPath: string;
  private readonly projectConfigPath: string;
  private readonly projectOpencodeDir: string;
  private readonly skillsLockPath: string;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
    this.globalConfigPath = path.join(
      os.homedir(),
      ".config",
      "opencode",
      "hybrid-arch.json",
    );
    this.globalAgentsPath = path.join(
      os.homedir(),
      ".config",
      "opencode",
      "AGENTS.md",
    );
    this.projectOpencodeDir = path.join(this.projectPath, ".opencode");
    this.projectConfigPath = path.join(
      this.projectOpencodeDir,
      "hybrid-arch.json",
    );
    this.skillsLockPath = path.join(this.projectPath, "skills.lock.json");
  }

  getGlobalConfigPath(): string {
    return this.globalConfigPath;
  }

  async initialize(): Promise<void> {
    await mkdir(path.dirname(this.globalConfigPath), { recursive: true });
    await mkdir(this.projectOpencodeDir, { recursive: true });
  }

  async reload(): Promise<void> {
    this.cachedState = null;
  }

  isArchitectureFile(filePath: string): boolean {
    const normalized = filePath.replace(/\\/g, "/");
    const base = path.basename(normalized);

    if (base === "skills.lock.json") return true;
    if (base === "AGENTS.md") return true;
    if (base === "CLAUDE.md") return true;
    if (base === ".cursorrules") return true;
    if (base === "hybrid-arch.json") return true;
    if (normalized.includes("/.opencode/skills/")) return true;

    return false;
  }

  async loadMergedState(): Promise<ArchitectureState> {
    if (this.cachedState) return this.cachedState;

    const globalConfig = await this.loadJsonIfExists<GlobalLayerConfig>(
      this.globalConfigPath,
      {},
    );
    const projectConfig = await this.loadJsonIfExists<ProjectLayerConfig>(
      this.projectConfigPath,
      {},
    );
    const lock = await this.loadJsonIfExists<SkillLockFile>(
      this.skillsLockPath,
      {},
    );

    const discoveredRules = await this.discoverProjectRuleFiles();
    const discoveredDocs = await this.discoverProjectDocDirs();

    const requested = this.normalizeLockSkills(lock);

    const globalSources: LayerSource[] = [
      {
        path: this.globalConfigPath,
        exists: await this.pathExists(this.globalConfigPath),
        kind: "config",
      },
      {
        path: this.globalAgentsPath,
        exists: await this.pathExists(this.globalAgentsPath),
        kind: "rules",
      },
    ];

    const projectSources: LayerSource[] = [
      {
        path: this.projectConfigPath,
        exists: await this.pathExists(this.projectConfigPath),
        kind: "config",
      },
      ...discoveredRules.map((p) => ({
        path: p,
        exists: true,
        kind: "rules" as const,
      })),
      ...discoveredDocs.map((p) => ({
        path: p,
        exists: true,
        kind: "docs" as const,
      })),
    ];

    const skillSources: LayerSource[] = [
      {
        path: this.skillsLockPath,
        exists: await this.pathExists(this.skillsLockPath),
        kind: "skills-lock",
      },
      {
        path: path.join(this.projectOpencodeDir, "skills"),
        exists: await this.pathExists(path.join(this.projectOpencodeDir, "skills")),
        kind: "skills-dir",
      },
      {
        path: path.join(os.homedir(), ".opencode", "skills"),
        exists: await this.pathExists(path.join(os.homedir(), ".opencode", "skills")),
        kind: "skills-dir",
      },
      {
        path: path.join(os.homedir(), ".config", "opencode", "skills"),
        exists: await this.pathExists(path.join(os.homedir(), ".config", "opencode", "skills")),
        kind: "skills-dir",
      },
    ];

    const merged = this.mergeLayers({
      global: {
        ...globalConfig,
        rules: this.mergeUniqueStrings(globalConfig.rules ?? [], []),
      },
      project: {
        ...projectConfig,
        rules: this.mergeUniqueStrings(projectConfig.rules ?? [], discoveredRules),
        docs: this.mergeUniqueStrings(projectConfig.docs ?? [], discoveredDocs),
      },
    });

    const state: ArchitectureState = {
      global: {
        configPath: this.globalConfigPath,
        config: globalConfig,
        sources: globalSources,
      },
      skill: {
        lockPath: this.skillsLockPath,
        lock,
        requested,
        sources: skillSources,
      },
      project: {
        projectPath: this.projectPath,
        configPath: this.projectConfigPath,
        config: projectConfig,
        sources: projectSources,
      },
      merged,
    };

    this.cachedState = state;
    return state;
  }

  private mergeLayers(input: {
    global: GlobalLayerConfig;
    project: ProjectLayerConfig;
  }): ArchitectureState["merged"] {
    // Project > Global
    const agents: Record<string, unknown> = {
      ...(input.global.agents ?? {}),
      ...(input.project.agents ?? {}),
    };

    const mcpServers = this.mergeUniqueStrings(input.global.mcpServers ?? [], []);

    const rules = this.mergeUniqueStrings(
      input.global.rules ?? [],
      input.project.rules ?? [],
    );

    const docs = this.mergeUniqueStrings([], input.project.docs ?? []);

    return {
      rules,
      docs,
      agents,
      mcpServers,
    };
  }

  formatInjectedContextMarkdown(
    state: ArchitectureState,
    skills: DiscoveredSkill[],
  ): string {
    const topSkills = skills
      .filter((s) => s.scope === "project")
      .slice(0, 8)
      .map((s) => `- ${s.name} (tool: ${s.toolName})`)
      .join("\n");

    return [
      "# Hybrid Architecture Context (Project > Skill > Global)",
      "",
      "## Active Rules Sources",
      ...state.project.sources
        .filter((s) => s.kind === "rules")
        .map((s) => `- ${path.basename(s.path)}`),
      "",
      "## Documentation Index",
      ...state.project.sources
        .filter((s) => s.kind === "docs")
        .map((s) => `- ${path.basename(s.path)}`),
      "",
      "## Requested Skills (skills.lock.json)",
      ...(state.skill.requested.length
        ? state.skill.requested.map((s) => `- ${s.name}@${s.version}`)
        : ["- (none)"]),
      "",
      "## Project Skills (highest priority)",
      topSkills.length ? topSkills : "- (none)",
      "",
      "## Priority Rules",
      "- Project overrides Skill overrides Global",
      "- When in doubt, follow Project layer rules first",
    ].join("\n");
  }

  formatCompactionContext(state: ArchitectureState, skills: DiscoveredSkill[]): string {
    const requested = state.skill.requested
      .slice(0, 10)
      .map((s) => `- ${s.name}@${s.version}`)
      .join("\n");
    const rules = state.merged.rules.slice(0, 10).map((r) => `- ${r}`).join("\n");
    const docs = state.merged.docs.slice(0, 10).map((d) => `- ${d}`).join("\n");

    return [
      "## Hybrid Architecture (Persistent Context)",
      "- Priority: Project > Skill > Global",
      "",
      "### Rules",
      rules || "- (none)",
      "",
      "### Docs",
      docs || "- (none)",
      "",
      "### Requested Skills",
      requested || "- (none)",
    ].join("\n");
  }

  formatStatusMarkdown(state: ArchitectureState, skills: DiscoveredSkill[]): string {
    const rules = state.merged.rules.map((r) => `- ${r}`).join("\n") || "- (none)";
    const docs = state.merged.docs.map((d) => `- ${d}`).join("\n") || "- (none)";
    const requested =
      state.skill.requested.map((s) => `- ${s.name}@${s.version}`).join("\n") ||
      "- (none)";

    const discovered = skills
      .slice(0, 50)
      .map((s) => `- ${s.name} (${s.scope}) -> ${s.toolName}`)
      .join("\n");

    return [
      "# Hybrid Architecture Status",
      "",
      "## Global Layer",
      `- Config: ${state.global.configPath}`,
      ...state.global.sources
        .filter((s) => s.exists)
        .map((s) => `- Source: ${s.path}`),
      "",
      "## Skill Layer",
      `- Lock: ${state.skill.lockPath}`,
      "### Requested",
      requested,
      "",
      "## Project Layer",
      `- Path: ${state.project.projectPath}`,
      ...state.project.sources
        .filter((s) => s.exists)
        .map((s) => `- Source: ${s.path}`),
      "",
      "## Effective Config (Merged)",
      "### Rules",
      rules,
      "",
      "### Docs",
      docs,
      "",
      "## Discovered Skills (first 50)",
      discovered || "- (none)",
    ].join("\n");
  }

  async initProjectScaffold(options: InitProjectScaffoldOptions): Promise<string> {
    await mkdir(this.projectOpencodeDir, { recursive: true });
    await mkdir(path.join(this.projectOpencodeDir, "skills"), { recursive: true });
    await mkdir(path.join(this.projectOpencodeDir, "commands"), { recursive: true });

    const created: string[] = [];

    if (!(await this.pathExists(this.projectConfigPath))) {
      const defaultProjectConfig: ProjectLayerConfig = {
        rules: ["AGENTS.md", "CLAUDE.md"],
        docs: [".next-docs", "docs"],
        agents: {},
      };
      await writeFile(
        this.projectConfigPath,
        JSON.stringify(defaultProjectConfig, null, 2),
        "utf8",
      );
      created.push(".opencode/hybrid-arch.json");
    }

    if (!(await this.pathExists(this.skillsLockPath))) {
      const lock: SkillLockFile = {
        skills: {
          "nextjs-docs-router": "1.0.0",
          "nextjs-debug": "1.0.0",
        },
        updatedAt: new Date().toISOString(),
      };
      await writeFile(this.skillsLockPath, JSON.stringify(lock, null, 2), "utf8");
      created.push("skills.lock.json");
    }

    if (options.writeCommands) {
      await ensureArchCommands(this.projectPath);
      created.push(".opencode/commands/{arch-status,arch-reload,arch-init}.md");
    }

    if (options.installBuiltinSkills) {
      // Install a couple of defaults into the project scope
      await options.skillManager.installBuiltInSkillToProject("nextjs-docs-router");
      await options.skillManager.installBuiltInSkillToProject("nextjs-debug");
      created.push(".opencode/skills/{nextjs-docs-router,nextjs-debug}/SKILL.md");
    }

    return [
      "✅ Initialized Hybrid Architecture project scaffold.",
      "",
      "Created/Ensured:",
      ...created.map((f) => `- ${f}`),
      "",
      "Next:",
      "- Run /arch-status to view status (command file)",
      "- Or call tool arch_status directly",
    ].join("\n");
  }

  private async discoverProjectRuleFiles(): Promise<string[]> {
    const candidates = ["AGENTS.md", "CLAUDE.md", ".cursorrules"]; 
    const found: string[] = [];
    for (const file of candidates) {
      const p = path.join(this.projectPath, file);
      if (await this.pathExists(p)) found.push(p);
    }
    return found;
  }

  private async discoverProjectDocDirs(): Promise<string[]> {
    const candidates = [".next-docs", "docs"]; 
    const found: string[] = [];
    for (const dir of candidates) {
      const p = path.join(this.projectPath, dir);
      if (await this.pathExists(p)) found.push(p);
    }
    return found;
  }

  private normalizeLockSkills(lock: SkillLockFile): SkillLockEntry[] {
    const skills = lock.skills ?? {};
    return Object.entries(skills)
      .map(([name, version]) => ({ name, version }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private async loadJsonIfExists<T>(filePath: string, fallback: T): Promise<T> {
    try {
      if (!(await this.pathExists(filePath))) return fallback;
      const raw = await readFile(filePath, "utf8");
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private async pathExists(p: string): Promise<boolean> {
    try {
      await access(p);
      return true;
    } catch {
      return false;
    }
  }

  private mergeUniqueStrings(...lists: Array<string[]>): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const list of lists) {
      for (const raw of list) {
        const v = String(raw);
        if (seen.has(v)) continue;
        seen.add(v);
        out.push(v);
      }
    }
    return out;
  }
}
