import * as path from "node:path";
import * as os from "node:os";
import { access, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tool } from "@opencode-ai/plugin/tool";
const BUILTIN_SKILLS = {
    "nextjs-docs-router": {
        version: "1.0.0",
        content: `---
name: nextjs-docs-router
version: 1.0.0
description: Next.js tasks gate: force retrieval from .next-docs/ before coding
tags:
  - nextjs
  - documentation
  - best-practices
allowed-tools:
  - read
  - grep
  - glob
  - bash
---

# nextjs-docs-router

## When to use

Use this skill when the user mentions: Next.js, App Router, Server Components, 'use cache', cookies(), headers(), connection(), forbidden(), unauthorized().

## Workflow

1. Locate project docs in .next-docs/.
2. Read the relevant API reference before changing code.
3. Call out breaking changes and common pitfalls.

## Verification checklist

- You consulted .next-docs/ before implementing.
- You avoided outdated Next.js assumptions.
`,
    },
    "nextjs-debug": {
        version: "1.0.0",
        content: `---
name: nextjs-debug
version: 1.0.0
description: Next.js debugging SOP: collect logs, find root cause, minimal fix, verify
tags:
  - nextjs
  - debugging
allowed-tools:
  - read
  - grep
  - glob
  - bash
---

# nextjs-debug

## Workflow

1. Collect build / typecheck logs.
2. Identify error class (build/type/runtime).
3. Find root cause (not symptoms).
4. Implement minimal fix.
5. Verify with build/typecheck.
`,
    },
};
export class SkillManager {
    ctx;
    configManager;
    discovered = null;
    constructor(ctx, configManager) {
        this.ctx = ctx;
        this.configManager = configManager;
    }
    async initialize() {
        // no-op for now; discovery is lazy
        await Promise.resolve();
    }
    getBuiltInSkillNames() {
        return Object.keys(BUILTIN_SKILLS).sort();
    }
    async discoverSkills() {
        if (this.discovered)
            return this.discovered;
        const projectDir = path.join(this.ctx.directory, ".opencode", "skills");
        const userDir = path.join(os.homedir(), ".opencode", "skills");
        const xdgDir = path.join(os.homedir(), ".config", "opencode", "skills");
        const byTool = new Map();
        // Priority: project > user > xdg
        await this.discoverFromBaseDir(projectDir, "project", byTool);
        await this.discoverFromBaseDir(userDir, "user", byTool);
        await this.discoverFromBaseDir(xdgDir, "xdg", byTool);
        // Add builtins as discoverable (not installed) items
        for (const [name, def] of Object.entries(BUILTIN_SKILLS)) {
            const toolName = `skills_${name.replace(/-/g, "_")}`;
            if (byTool.has(toolName))
                continue;
            byTool.set(toolName, {
                name,
                version: def.version,
                description: this.extractDescription(def.content) ?? "",
                scope: "builtin",
                fullPath: "(builtin)",
                skillMdPath: "(builtin)",
                toolName,
                content: this.extractMarkdownBody(def.content),
            });
        }
        this.discovered = Array.from(byTool.values()).sort((a, b) => a.toolName.localeCompare(b.toolName));
        return this.discovered;
    }
    async buildDynamicSkillTools() {
        const skills = await this.discoverSkills();
        const tools = {};
        const pluginCtx = this.ctx;
        for (const skill of skills) {
            // Builtins should only be callable after installation (otherwise their baseDir doesn't exist)
            if (skill.scope === "builtin")
                continue;
            tools[skill.toolName] = tool({
                description: skill.description,
                args: {},
                async execute(_args, toolCtx) {
                    const sendSilentPrompt = (text) => pluginCtx.client.session.prompt({
                        path: { id: toolCtx.sessionID },
                        body: { noReply: true, parts: [{ type: "text", text }] },
                        query: { directory: pluginCtx.directory },
                    });
                    await sendSilentPrompt(`The "${skill.name}" skill is loading\n${skill.name}`);
                    await sendSilentPrompt(`Base directory for this skill: ${skill.fullPath}\n\n${skill.content}`);
                    return `Launching skill: ${skill.name}`;
                },
            });
        }
        return tools;
    }
    formatSkillListMarkdown(state, skills) {
        const requested = new Set(state.skill.requested.map((s) => s.name));
        const lines = [];
        lines.push("# Skills");
        lines.push("");
        lines.push("## Requested (skills.lock.json)");
        if (state.skill.requested.length === 0) {
            lines.push("- (none)");
        }
        else {
            for (const s of state.skill.requested) {
                lines.push(`- ${s.name}@${s.version}`);
            }
        }
        lines.push("");
        lines.push("## Discovered");
        for (const skill of skills) {
            const mark = requested.has(skill.name) ? "*" : " ";
            lines.push(`- ${mark} ${skill.name} (${skill.scope}) -> ${skill.toolName}  ` +
                `v${skill.version}`);
        }
        lines.push("");
        lines.push("Legend: '*' = requested by skills.lock.json");
        return lines.join("\n");
    }
    async installBuiltInSkillToProject(name) {
        const def = BUILTIN_SKILLS[name];
        if (!def) {
            return `Unknown built-in skill: ${name}. Available: ${this.getBuiltInSkillNames().join(", ")}`;
        }
        const projectSkillsDir = path.join(this.ctx.directory, ".opencode", "skills");
        const skillDir = path.join(projectSkillsDir, name);
        const skillMd = path.join(skillDir, "SKILL.md");
        await mkdir(skillDir, { recursive: true });
        await writeFile(skillMd, def.content, "utf8");
        await this.upsertSkillLock(name, def.version);
        this.discovered = null;
        return `✅ Installed built-in skill "${name}" into .opencode/skills and updated skills.lock.json.`;
    }
    async uninstallProjectSkill(name) {
        const skillDir = path.join(this.ctx.directory, ".opencode", "skills", name);
        if (await this.pathExists(skillDir)) {
            await rm(skillDir, { recursive: true, force: true });
        }
        await this.removeFromSkillLock(name);
        this.discovered = null;
        return `🗑️ Uninstalled project skill "${name}" and updated skills.lock.json.`;
    }
    async upsertSkillLock(name, version) {
        const lockPath = path.join(this.ctx.directory, "skills.lock.json");
        const lock = (await this.pathExists(lockPath))
            ? JSON.parse(await readFile(lockPath, "utf8"))
            : {};
        lock.skills = lock.skills ?? {};
        lock.skills[name] = version;
        lock.updatedAt = new Date().toISOString();
        await writeFile(lockPath, JSON.stringify(lock, null, 2), "utf8");
    }
    async removeFromSkillLock(name) {
        const lockPath = path.join(this.ctx.directory, "skills.lock.json");
        if (!(await this.pathExists(lockPath)))
            return;
        const lock = JSON.parse(await readFile(lockPath, "utf8"));
        if (!lock.skills)
            return;
        delete lock.skills[name];
        lock.updatedAt = new Date().toISOString();
        await writeFile(lockPath, JSON.stringify(lock, null, 2), "utf8");
    }
    async discoverFromBaseDir(baseDir, scope, byTool) {
        if (!(await this.pathExists(baseDir)))
            return;
        const skillMdPaths = await this.walkForSkillMd(baseDir);
        for (const skillMdPath of skillMdPaths) {
            const parsed = await this.parseSkill(skillMdPath, baseDir, scope);
            if (!parsed)
                continue;
            // respect priority order: we call this method in order already
            if (byTool.has(parsed.toolName))
                continue;
            byTool.set(parsed.toolName, parsed);
        }
    }
    async parseSkill(skillMdPath, baseDir, scope) {
        try {
            const raw = await readFile(skillMdPath, "utf8");
            const parsed = this.parseSkillMd(raw);
            if (!parsed.frontmatter.name || !parsed.frontmatter.description)
                return null;
            if (!/^[a-z0-9-]+$/.test(parsed.frontmatter.name))
                return null;
            if (parsed.frontmatter.description.length < 10)
                return null;
            const dirName = path.basename(path.dirname(skillMdPath));
            if (parsed.frontmatter.name !== dirName)
                return null;
            const toolName = this.generateToolName(skillMdPath, baseDir);
            return {
                name: parsed.frontmatter.name,
                version: parsed.frontmatter.version ?? "local",
                description: parsed.frontmatter.description,
                tags: parsed.frontmatter.tags,
                allowedTools: parsed.frontmatter["allowed-tools"],
                scope,
                fullPath: path.dirname(skillMdPath),
                skillMdPath,
                toolName,
                content: parsed.body.trim(),
            };
        }
        catch {
            return null;
        }
    }
    async walkForSkillMd(root) {
        const out = [];
        const queue = [root];
        while (queue.length) {
            const dir = queue.shift();
            if (!dir)
                break;
            let entries = [];
            try {
                entries = await readdir(dir);
            }
            catch {
                continue;
            }
            for (const entry of entries) {
                const p = path.join(dir, entry);
                let st;
                try {
                    st = await stat(p);
                }
                catch {
                    continue;
                }
                if (st.isDirectory()) {
                    queue.push(p);
                }
                else if (st.isFile() && entry.toLowerCase() === "skill.md") {
                    out.push(p);
                }
            }
        }
        return out;
    }
    generateToolName(skillPath, baseDir) {
        const rel = path.relative(baseDir, skillPath);
        const dirPath = path.dirname(rel);
        const components = dirPath
            .split(path.sep)
            .filter((c) => c && c !== ".")
            .map((c) => c.replace(/-/g, "_"));
        return "skills_" + components.join("_");
    }
    extractDescription(skillMd) {
        const parsed = this.parseSkillMd(skillMd);
        return parsed.frontmatter.description ?? null;
    }
    extractMarkdownBody(skillMd) {
        return this.parseSkillMd(skillMd).body.trim();
    }
    parseSkillMd(raw) {
        const trimmed = raw.replace(/^\ufeff/, "");
        if (!trimmed.startsWith("---")) {
            return { frontmatter: {}, body: trimmed };
        }
        const end = trimmed.indexOf("\n---", 3);
        if (end === -1) {
            return { frontmatter: {}, body: trimmed };
        }
        const fmRaw = trimmed.slice(3, end).trim();
        const body = trimmed.slice(end + "\n---".length).trimStart();
        const frontmatter = this.parseSimpleYamlFrontmatter(fmRaw);
        return { frontmatter, body };
    }
    parseSimpleYamlFrontmatter(fm) {
        // Minimal YAML subset parser: key: value, and key: list with "- item" lines.
        const out = {};
        const lines = fm.split(/\r?\n/);
        let currentListKey = null;
        for (const line of lines) {
            const l = line.trimEnd();
            if (!l.trim())
                continue;
            const listItem = l.match(/^\s*-\s+(.*)$/);
            if (listItem && currentListKey) {
                const v = listItem[1].trim();
                if (!v)
                    continue;
                const arr = out[currentListKey] ?? [];
                arr.push(v);
                out[currentListKey] = arr;
                continue;
            }
            const kv = l.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*)\s*$/);
            if (!kv)
                continue;
            const key = kv[1];
            const value = kv[2];
            currentListKey = null;
            if (key === "tags" || key === "allowed-tools") {
                out[key] = [];
                currentListKey = key;
                if (value && value !== "[]") {
                    // inline single value
                    out[key].push(value.trim());
                }
                continue;
            }
            const v = value.trim();
            if (key === "name")
                out.name = v;
            else if (key === "description")
                out.description = v;
            else if (key === "version")
                out.version = v;
            else if (key === "author")
                out.author = v;
        }
        return out;
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
}
export default SkillManager;
//# sourceMappingURL=SkillManager.js.map