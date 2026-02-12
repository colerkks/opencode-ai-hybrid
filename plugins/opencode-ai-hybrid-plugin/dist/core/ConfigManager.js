import * as path from "node:path";
import * as os from "node:os";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { ensureArchCommands } from "../commands/index.js";
export class ConfigManager {
    projectPath;
    cachedState = null;
    globalConfigPath;
    globalAgentsPath;
    legacyGlobalConfigPath;
    legacyGlobalAgentsPath;
    projectConfigPath;
    projectOpencodeDir;
    skillsLockPath;
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.globalConfigPath = path.join(os.homedir(), ".config", "opencode", "opencode-ai-hybrid", "hybrid-arch.json");
        this.globalAgentsPath = path.join(os.homedir(), ".config", "opencode", "opencode-ai-hybrid", "AGENTS.md");
        this.legacyGlobalConfigPath = path.join(os.homedir(), ".config", "opencode", "hybrid-arch.json");
        this.legacyGlobalAgentsPath = path.join(os.homedir(), ".config", "opencode", "AGENTS.md");
        this.projectOpencodeDir = path.join(this.projectPath, ".opencode");
        this.projectConfigPath = path.join(this.projectOpencodeDir, "hybrid-arch.json");
        this.skillsLockPath = path.join(this.projectPath, "skills.lock.json");
    }
    getGlobalConfigPath() {
        return this.globalConfigPath;
    }
    async initialize() {
        await mkdir(path.dirname(this.globalConfigPath), { recursive: true });
        await mkdir(this.projectOpencodeDir, { recursive: true });
    }
    async reload() {
        this.cachedState = null;
    }
    isArchitectureFile(filePath) {
        const normalized = filePath.replace(/\\/g, "/");
        const base = path.basename(normalized);
        if (base === "skills.lock.json")
            return true;
        if (base === "AGENTS.md")
            return true;
        if (base === "CLAUDE.md")
            return true;
        if (base === ".cursorrules")
            return true;
        if (base === "hybrid-arch.json")
            return true;
        if (normalized.includes("/.opencode/skills/"))
            return true;
        return false;
    }
    async loadMergedState() {
        if (this.cachedState)
            return this.cachedState;
        const hasScopedGlobalConfig = await this.pathExists(this.globalConfigPath);
        const hasLegacyGlobalConfig = await this.pathExists(this.legacyGlobalConfigPath);
        const effectiveGlobalConfigPath = hasScopedGlobalConfig
            ? this.globalConfigPath
            : this.legacyGlobalConfigPath;
        const effectiveGlobalAgentsPath = (await this.pathExists(this.globalAgentsPath))
            ? this.globalAgentsPath
            : this.legacyGlobalAgentsPath;
        const globalConfig = await this.loadJsonIfExists(effectiveGlobalConfigPath, {});
        const projectConfig = await this.loadJsonIfExists(this.projectConfigPath, {});
        const lock = await this.loadJsonIfExists(this.skillsLockPath, {});
        const discoveredRules = await this.discoverProjectRuleFiles();
        const discoveredDocs = await this.discoverProjectDocDirs();
        const requested = this.normalizeLockSkills(lock);
        const globalSources = [
            {
                path: this.globalConfigPath,
                exists: hasScopedGlobalConfig,
                kind: "config",
            },
            {
                path: this.legacyGlobalConfigPath,
                exists: hasLegacyGlobalConfig,
                kind: "config",
            },
            {
                path: this.globalAgentsPath,
                exists: await this.pathExists(this.globalAgentsPath),
                kind: "rules",
            },
            {
                path: this.legacyGlobalAgentsPath,
                exists: await this.pathExists(this.legacyGlobalAgentsPath),
                kind: "rules",
            },
        ];
        const projectSources = [
            {
                path: this.projectConfigPath,
                exists: await this.pathExists(this.projectConfigPath),
                kind: "config",
            },
            ...discoveredRules.map((p) => ({
                path: p,
                exists: true,
                kind: "rules",
            })),
            ...discoveredDocs.map((p) => ({
                path: p,
                exists: true,
                kind: "docs",
            })),
        ];
        const skillSources = [
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
        const state = {
            global: {
                configPath: effectiveGlobalConfigPath,
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
    mergeLayers(input) {
        // Project > Global
        const agents = {
            ...(input.global.agents ?? {}),
            ...(input.project.agents ?? {}),
        };
        const mcpServers = this.mergeUniqueStrings(input.global.mcpServers ?? [], []);
        const rules = this.mergeUniqueStrings(input.global.rules ?? [], input.project.rules ?? []);
        const docs = this.mergeUniqueStrings([], input.project.docs ?? []);
        return {
            rules,
            docs,
            agents,
            mcpServers,
        };
    }
    formatInjectedContextMarkdown(state, skills) {
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
    formatCompactionContext(state, skills) {
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
    formatStatusMarkdown(state, skills) {
        const rules = state.merged.rules.map((r) => `- ${r}`).join("\n") || "- (none)";
        const docs = state.merged.docs.map((d) => `- ${d}`).join("\n") || "- (none)";
        const requested = state.skill.requested.map((s) => `- ${s.name}@${s.version}`).join("\n") ||
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
    async initProjectScaffold(options) {
        await mkdir(this.projectOpencodeDir, { recursive: true });
        await mkdir(path.join(this.projectOpencodeDir, "skills"), { recursive: true });
        await mkdir(path.join(this.projectOpencodeDir, "commands"), { recursive: true });
        const created = [];
        if (!(await this.pathExists(this.projectConfigPath))) {
            const defaultProjectConfig = {
                rules: ["AGENTS.md", "CLAUDE.md"],
                docs: [".next-docs", "docs"],
                agents: {},
            };
            await writeFile(this.projectConfigPath, JSON.stringify(defaultProjectConfig, null, 2), "utf8");
            created.push(".opencode/hybrid-arch.json");
        }
        if (!(await this.pathExists(this.skillsLockPath))) {
            const lock = {
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
    async discoverProjectRuleFiles() {
        const candidates = ["AGENTS.md", "CLAUDE.md", ".cursorrules"];
        const found = [];
        for (const file of candidates) {
            const p = path.join(this.projectPath, file);
            if (await this.pathExists(p))
                found.push(p);
        }
        return found;
    }
    async discoverProjectDocDirs() {
        const candidates = [".next-docs", "docs"];
        const found = [];
        for (const dir of candidates) {
            const p = path.join(this.projectPath, dir);
            if (await this.pathExists(p))
                found.push(p);
        }
        return found;
    }
    normalizeLockSkills(lock) {
        const skills = lock.skills ?? {};
        return Object.entries(skills)
            .map(([name, version]) => ({ name, version }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    async loadJsonIfExists(filePath, fallback) {
        try {
            if (!(await this.pathExists(filePath)))
                return fallback;
            const raw = await readFile(filePath, "utf8");
            return JSON.parse(raw);
        }
        catch {
            return fallback;
        }
    }
    async pathExists(p) {
        try {
            await access(p);
            return true;
        }
        catch {
            return false;
        }
    }
    mergeUniqueStrings(...lists) {
        const seen = new Set();
        const out = [];
        for (const list of lists) {
            for (const raw of list) {
                const v = String(raw);
                if (seen.has(v))
                    continue;
                seen.add(v);
                out.push(v);
            }
        }
        return out;
    }
}
//# sourceMappingURL=ConfigManager.js.map