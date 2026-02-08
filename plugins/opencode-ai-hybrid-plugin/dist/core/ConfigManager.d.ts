import type { ArchitectureState, DiscoveredSkill } from "../types/index.js";
type InitProjectScaffoldOptions = {
    installBuiltinSkills: boolean;
    writeCommands: boolean;
    skillManager: any;
};
export declare class ConfigManager {
    private readonly projectPath;
    private cachedState;
    private readonly globalConfigPath;
    private readonly globalAgentsPath;
    private readonly projectConfigPath;
    private readonly projectOpencodeDir;
    private readonly skillsLockPath;
    constructor(projectPath: string);
    getGlobalConfigPath(): string;
    initialize(): Promise<void>;
    reload(): Promise<void>;
    isArchitectureFile(filePath: string): boolean;
    loadMergedState(): Promise<ArchitectureState>;
    private mergeLayers;
    formatInjectedContextMarkdown(state: ArchitectureState, skills: DiscoveredSkill[]): string;
    formatCompactionContext(state: ArchitectureState, skills: DiscoveredSkill[]): string;
    formatStatusMarkdown(state: ArchitectureState, skills: DiscoveredSkill[]): string;
    initProjectScaffold(options: InitProjectScaffoldOptions): Promise<string>;
    private discoverProjectRuleFiles;
    private discoverProjectDocDirs;
    private normalizeLockSkills;
    private loadJsonIfExists;
    private pathExists;
    private mergeUniqueStrings;
}
export {};
//# sourceMappingURL=ConfigManager.d.ts.map