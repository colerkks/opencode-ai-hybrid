import type { ArchitectureState, DiscoveredSkill } from "../types/index.js";

/**
 * OpenCode plugins cannot render custom sidebar panels directly.
 * We approximate the "TUI panel" requirement with a toast + minimal prompt hint.
 */
export async function showArchToast(
  client: any,
  state: ArchitectureState,
  skills: DiscoveredSkill[],
): Promise<void> {
  try {
    const requested = state.skill.requested.length;
    const projectSkills = skills.filter((s) => s.scope === "project").length;
    const rules = state.merged.rules.length;

    await client.tui.showToast({
      body: {
        title: "Hybrid Arch",
        message: `Loaded. rules=${rules}, requestedSkills=${requested}, projectSkills=${projectSkills}. Use /arch-status.`,
        variant: "info",
        duration: 5000,
      },
    });
  } catch {
    // Ignore UI errors (headless or older OpenCode)
  }
}
