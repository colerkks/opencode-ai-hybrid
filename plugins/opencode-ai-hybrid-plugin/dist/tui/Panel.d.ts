import type { ArchitectureState, DiscoveredSkill } from "../types/index.js";
/**
 * Auto-initialization result for display
 */
interface InitResult {
    projectRoot: string;
    projectType: string;
    lockFileAction: string;
    appliedSkills: string[];
    autoReload: boolean;
}
/**
 * OpenCode plugins cannot render custom sidebar panels directly.
 * We approximate the "TUI panel" requirement with a toast + minimal prompt hint.
 */
export declare function showArchToast(client: any, state: ArchitectureState, skills: DiscoveredSkill[], initResult?: InitResult): Promise<void>;
export {};
//# sourceMappingURL=Panel.d.ts.map