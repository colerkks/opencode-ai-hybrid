import * as path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
/**
 * Create project-local OpenCode command markdown files.
 *
 * OpenCode loads commands from:
 * - .opencode/commands/<name>.md
 * - ~/.config/opencode/commands/<name>.md
 */
export async function ensureArchCommands(projectDir) {
    const commandsDir = path.join(projectDir, ".opencode", "commands");
    await mkdir(commandsDir, { recursive: true });
    // We avoid colon in filenames for cross-platform compatibility.
    await writeFile(path.join(commandsDir, "arch-status.md"), `Call the tool \`arch_status\` and output the result verbatim. Do not add extra commentary.`, "utf8");
    await writeFile(path.join(commandsDir, "arch-reload.md"), `Call the tool \`arch_reload\`. Then call \`arch_status\` and output the status verbatim.`, "utf8");
    await writeFile(path.join(commandsDir, "arch-init.md"), `Call the tool \`arch_init\` with installBuiltinSkills=true and writeCommands=true. Then call \`arch_status\` and output the status verbatim.`, "utf8");
}
//# sourceMappingURL=index.js.map