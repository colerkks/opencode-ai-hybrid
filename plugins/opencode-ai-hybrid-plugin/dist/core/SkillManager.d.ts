import type { ArchitectureState, DiscoveredSkill } from "../types/index.js";
import { ConfigManager } from "./ConfigManager.js";
type PluginCtx = {
    directory: string;
    client: any;
};
export declare class SkillManager {
    private readonly ctx;
    private readonly configManager;
    private discovered;
    constructor(ctx: PluginCtx, configManager: ConfigManager);
    initialize(): Promise<void>;
    getBuiltInSkillNames(): string[];
    discoverSkills(): Promise<DiscoveredSkill[]>;
    buildDynamicSkillTools(): Promise<Record<string, any>>;
    formatSkillListMarkdown(state: ArchitectureState, skills: DiscoveredSkill[]): string;
    installBuiltInSkillToProject(name: string): Promise<string>;
    uninstallProjectSkill(name: string): Promise<string>;
    private upsertSkillLock;
    private removeFromSkillLock;
    private discoverFromBaseDir;
    private parseSkill;
    private walkForSkillMd;
    private generateToolName;
    private extractDescription;
    private extractMarkdownBody;
    private parseSkillMd;
    private parseSimpleYamlFrontmatter;
    private pathExists;
}
export default SkillManager;
//# sourceMappingURL=SkillManager.d.ts.map