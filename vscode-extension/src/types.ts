export interface Skill {
    name: string;
    description?: string;
    version: string;
    path: string;
    type: 'global' | 'skill' | 'project';
}

export interface ArchSource {
    name: string;
    path: string;
    type: 'global' | 'skill' | 'project';
}

export interface ArchStatus {
    version: string;
    global: {
        path: string;
        skills: Skill[];
        sources: ArchSource[];
    };
    skill: {
        path: string;
        skills: Skill[];
        sources: ArchSource[];
    };
    project: {
        path: string;
        skills: Skill[];
        sources: ArchSource[];
    };
    sources: ArchSource[];
}

export interface HybridArchConfig {
    version: string;
    project?: {
        name: string;
        description?: string;
    };
    sources?: string[];
    skills?: {
        installed?: string[];
        autoLoad?: boolean;
    };
    commands?: {
        autoRegister?: boolean;
    };
}

export interface SkillManifest {
    name: string;
    version: string;
    description?: string;
    author?: string;
    triggers?: string[];
    tools?: string[];
}
