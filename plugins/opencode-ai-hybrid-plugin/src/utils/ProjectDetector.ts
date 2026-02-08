import * as path from "node:path";
import * as fs from "node:fs";
import { access } from "node:fs/promises";

/**
 * Project root detection utility
 * Automatically finds project root by looking for marker files
 */
export class ProjectDetector {
  // Marker files that indicate project root
  private static readonly ROOT_MARKERS = [
    ".git",
    "package.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "bun.lockb",
    "Cargo.toml",
    "pyproject.toml",
    "requirements.txt",
    "go.mod",
    "pom.xml",
    "build.gradle",
    "CMakeLists.txt",
    ".opencode",
    "AGENTS.md",
    "skills.lock.json",
  ];

  /**
   * Find project root starting from a given directory
   * Walks up the directory tree until a marker is found
   */
  static async findProjectRoot(startDir: string): Promise<string> {
    let currentDir = path.resolve(startDir);

    // Walk up the directory tree
    while (currentDir !== path.dirname(currentDir)) {
      // Check if any marker exists in current directory
      for (const marker of this.ROOT_MARKERS) {
        const markerPath = path.join(currentDir, marker);
        try {
          await access(markerPath);
          // Found a marker, this is the project root
          return currentDir;
        } catch {
          // Marker not found, continue checking
        }
      }

      // Move up one directory
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        // Reached root of filesystem
        break;
      }
      currentDir = parentDir;
    }

    // No marker found, return the original directory
    return path.resolve(startDir);
  }

  /**
   * Synchronous version for use in constructors
   */
  static findProjectRootSync(startDir: string): string {
    let currentDir = path.resolve(startDir);

    while (currentDir !== path.dirname(currentDir)) {
      for (const marker of this.ROOT_MARKERS) {
        const markerPath = path.join(currentDir, marker);
        if (fs.existsSync(markerPath)) {
          return currentDir;
        }
      }

      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        break;
      }
      currentDir = parentDir;
    }

    return path.resolve(startDir);
  }

  /**
   * Detect project type based on files present
   */
  static detectProjectType(projectRoot: string): string {
    const files = fs.readdirSync(projectRoot);

    if (files.includes("next.config.js") || files.includes("next.config.ts")) {
      return "nextjs";
    }
    if (files.includes("package.json")) {
      return "nodejs";
    }
    if (files.includes("pyproject.toml") || files.includes("requirements.txt")) {
      return "python";
    }
    if (files.includes("Cargo.toml")) {
      return "rust";
    }
    if (files.includes("go.mod")) {
      return "go";
    }

    return "generic";
  }
}