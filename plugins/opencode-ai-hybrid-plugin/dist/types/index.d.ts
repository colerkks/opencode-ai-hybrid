export type JsonObject = Record<string, unknown>;
export type LayerSource = {
    path: string;
    exists: boolean;
    kind: "config" | "rules" | "docs" | "skills-lock" | "skills-dir" | "other";
};
export type GlobalLayerConfig = {
    agents?: Record<string, unknown>;
    mcpServers?: string[];
    rules?: string[];
};
export type ProjectLayerConfig = {
    rules?: string[];
    docs?: string[];
    agents?: Record<string, unknown>;
};
export type SkillLockFile = {
    skills?: Record<string, string>;
    updatedAt?: string;
};
export type SkillLockEntry = {
    name: string;
    version: string;
};
export type SkillScope = "project" | "user" | "xdg" | "builtin";
export type DiscoveredSkill = {
    name: string;
    version: string;
    description: string;
    scope: SkillScope;
    fullPath: string;
    skillMdPath: string;
    toolName: string;
    allowedTools?: string[];
    content: string;
    tags?: string[];
};
export type ArchitectureState = {
    global: {
        configPath: string;
        config: GlobalLayerConfig;
        sources: LayerSource[];
    };
    skill: {
        lockPath: string;
        lock: SkillLockFile;
        requested: SkillLockEntry[];
        sources: LayerSource[];
    };
    project: {
        projectPath: string;
        configPath: string;
        config: ProjectLayerConfig;
        sources: LayerSource[];
    };
    merged: {
        rules: string[];
        docs: string[];
        agents: Record<string, unknown>;
        mcpServers: string[];
    };
};
//# sourceMappingURL=index.d.ts.map