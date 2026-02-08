import { tool } from "@opencode-ai/plugin/tool";
import { ConfigManager } from "./core/ConfigManager.js";
import { SkillManager } from "./core/SkillManager.js";
import { ensureArchCommands } from "./commands/index.js";
import { showArchToast } from "./tui/Panel.js";
import { AutoInitializer } from "./utils/AutoInitializer.js";
const HybridArchPlugin = async (ctx) => {
    const configManager = new ConfigManager(ctx.directory);
    const skillManager = new SkillManager(ctx, configManager);
    await configManager.initialize();
    await skillManager.initialize();
    const getState = async () => {
        const state = await configManager.loadMergedState();
        const skills = await skillManager.discoverSkills();
        return { state, skills };
    };
    let cached = await getState();
    const arch_status = tool({
        description: "Show current Hybrid Architecture status (Global + Skill + Project) with discovered sources and skills.",
        args: {},
        async execute(_args, _toolCtx) {
            const { state, skills } = cached;
            const md = configManager.formatStatusMarkdown(state, skills);
            return md;
        },
    });
    const arch_reload = tool({
        description: "Reload Hybrid Architecture configuration from disk (Global/Skill/Project) and re-discover skills.",
        args: {},
        async execute(_args, _toolCtx) {
            await configManager.reload();
            cached = await getState();
            return "Reloaded hybrid-arch configuration and skills.";
        },
    });
    const arch_init = tool({
        description: "Initialize Hybrid Architecture project files (.opencode/hybrid-arch.json, skills.lock.json, commands, and optional built-in skills).",
        args: {
            installBuiltinSkills: tool.schema.boolean().optional(),
            writeCommands: tool.schema.boolean().optional(),
        },
        async execute(args, _toolCtx) {
            const installBuiltinSkills = args.installBuiltinSkills ?? true;
            const writeCommands = args.writeCommands ?? true;
            const result = await configManager.initProjectScaffold({
                installBuiltinSkills,
                writeCommands,
                skillManager,
            });
            cached = await getState();
            return result;
        },
    });
    const arch_skill_list = tool({
        description: "List discovered skills and which ones are requested by skills.lock.json.",
        args: {},
        async execute(_args, _toolCtx) {
            const { state, skills } = cached;
            return skillManager.formatSkillListMarkdown(state, skills);
        },
    });
    const arch_skill_install = tool({
        description: "Install a built-in skill into the current project (.opencode/skills/<skill>/SKILL.md) and update skills.lock.json.",
        args: {
            name: tool.schema.string(),
        },
        async execute(args, _toolCtx) {
            const msg = await skillManager.installBuiltInSkillToProject(args.name);
            cached = await getState();
            return msg;
        },
    });
    const arch_skill_uninstall = tool({
        description: "Uninstall a project skill (.opencode/skills/<skill>) and update skills.lock.json.",
        args: {
            name: tool.schema.string(),
        },
        async execute(args, _toolCtx) {
            const msg = await skillManager.uninstallProjectSkill(args.name);
            cached = await getState();
            return msg;
        },
    });
    const dynamicSkillTools = await skillManager.buildDynamicSkillTools();
    return {
        tool: {
            arch_status,
            arch_reload,
            arch_init,
            arch_skill_list,
            arch_skill_install,
            arch_skill_uninstall,
            ...dynamicSkillTools,
        },
        // Primary event stream hook
        event: async ({ event }) => {
            if (event.type === "session.created") {
                const props = (event.properties ?? {});
                const sessionID = props.info?.id;
                if (!sessionID)
                    return;
                // AUTO-INITIALIZATION: Run automatic setup for new sessions
                const autoInit = new AutoInitializer(ctx.directory);
                const initResult = await autoInit.initialize();
                // If skills were applied, reload to pick them up
                if (initResult.appliedSkills.length > 0 && initResult.autoReload) {
                    await configManager.reload();
                    cached = await getState();
                }
                // Ensure project commands exist so users can run /arch-status etc.
                // This is safe: only writes into .opencode/commands.
                await ensureArchCommands(ctx.directory);
                // Inject merged architecture context into the session (silent)
                const { state, skills } = cached;
                const contextMd = configManager.formatInjectedContextMarkdown(state, skills);
                await ctx.client.session.prompt({
                    path: { id: sessionID },
                    body: {
                        noReply: true,
                        parts: [
                            {
                                type: "text",
                                text: contextMd,
                            },
                        ],
                    },
                    query: { directory: ctx.directory },
                });
                // Surface a small UI hint with auto-init info
                await showArchToast(ctx.client, state, skills, initResult);
            }
        },
        // Security + auto-reload on edits
        "tool.execute.before": async (input, output) => {
            if (input.tool === "read") {
                const filePath = String(output.args?.filePath ?? "");
                const lower = filePath.toLowerCase();
                if (lower.includes(".env") || lower.includes("credentials") || lower.includes("secrets")) {
                    throw new Error(`Access denied: Cannot read sensitive file ${filePath}`);
                }
            }
        },
        "tool.execute.after": async (input, output) => {
            if (!output)
                return;
            const toolName = input.tool;
            if (toolName !== "write" && toolName !== "edit")
                return;
            const filePath = String(input.args?.filePath ?? "");
            if (configManager.isArchitectureFile(filePath)) {
                await configManager.reload();
                cached = await getState();
            }
        },
        // Inject environment variables for shell/tooling
        "shell.env": async (input, output) => {
            output.env.OPENCODE_HYBRID_ARCH = "1";
            output.env.OPENCODE_HYBRID_ARCH_PROJECT = ctx.directory;
            output.env.OPENCODE_HYBRID_ARCH_GLOBAL_CONFIG = configManager.getGlobalConfigPath();
        },
        // Preserve architecture context across compaction
        "experimental.session.compacting": async (_input, output) => {
            const { state, skills } = cached;
            output.context.push(configManager.formatCompactionContext(state, skills));
        },
    };
};
export default HybridArchPlugin;
// IMPORTANT:
// Do NOT export anything else from this file.
// OpenCode treats all exports as plugin instances and calls them.
//# sourceMappingURL=index.js.map