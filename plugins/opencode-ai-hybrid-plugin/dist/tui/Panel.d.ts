import type { ArchitectureState, DiscoveredSkill } from "../types/index.js";
/**
 * OpenCode plugins cannot render custom sidebar panels directly.
 * We approximate the "TUI panel" requirement with a toast + minimal prompt hint.
 */
export declare function showArchToast(client: any, state: ArchitectureState, skills: DiscoveredSkill[]): Promise<void>;
//# sourceMappingURL=Panel.d.ts.map