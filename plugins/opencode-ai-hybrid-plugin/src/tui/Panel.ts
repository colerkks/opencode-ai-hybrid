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
export async function showArchToast(
  client: any,
  state: ArchitectureState,
  skills: DiscoveredSkill[],
  initResult?: InitResult,
): Promise<void> {
  try {
    const requested = state.skill.requested.length;
    const projectSkills = skills.filter((s) => s.scope === "project").length;
    const rules = state.merged.rules.length;

    let message = `Loaded. rules=${rules}, requestedSkills=${requested}, projectSkills=${projectSkills}. Use /arch-status.`;

    // Add auto-init info if available
    if (initResult) {
      const action = initResult.lockFileAction;
      if (action === "created" || action === "filled") {
        const skillNames = initResult.appliedSkills.join(", ");
        message = `Auto-init: ${action} skills.lock.json with ${skillNames}. ${message}`;
      } else if (action === "skipped" && initResult.appliedSkills.length === 0) {
        message = `Using existing skills.lock.json. ${message}`;
      }
    }

    await client.tui.showToast({
      body: {
        title: "Hybrid Arch",
        message,
        variant: "info",
        duration: 6000,
      },
    });
  } catch {
    // Ignore UI errors (headless or older OpenCode)
  }
}
