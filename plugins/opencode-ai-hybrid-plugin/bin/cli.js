#!/usr/bin/env node

import { Command } from "commander";
import * as fs from "fs-extra";
import * as path from "path";
import * as os from "os";

const program = new Command();

program.name("hybrid-arch").description("Hybrid Architecture plugin CLI");

program
  .command("install")
  .description("Add @opencode-ai/hybrid-arch to your OpenCode config plugins")
  .action(async () => {
    const configDir = path.join(os.homedir(), ".config", "opencode");
    const configPath = path.join(configDir, "opencode.json");
    await fs.ensureDir(configDir);

    const config = (await fs.pathExists(configPath))
      ? await fs.readJson(configPath)
      : { $schema: "https://opencode.ai/config.json" };

    const plugins = Array.isArray(config.plugin) ? config.plugin : [];
    if (!plugins.includes("@opencode-ai/hybrid-arch")) {
      plugins.push("@opencode-ai/hybrid-arch");
    }
    config.plugin = plugins;
    await fs.writeJson(configPath, config, { spaces: 2 });

    console.log("✅ Installed plugin reference into:");
    console.log(`   ${configPath}`);
    console.log("\nNext:");
    console.log("- Run: opencode");
    console.log("- Then run command: /arch-init");
  });

program
  .command("uninstall")
  .description("Remove @opencode-ai/hybrid-arch from OpenCode config")
  .action(async () => {
    const configPath = path.join(os.homedir(), ".config", "opencode", "opencode.json");
    if (!(await fs.pathExists(configPath))) {
      console.log("No OpenCode config found.");
      return;
    }

    const config = await fs.readJson(configPath);
    const plugins = Array.isArray(config.plugin) ? config.plugin : [];
    config.plugin = plugins.filter((p) => p !== "@opencode-ai/hybrid-arch");
    await fs.writeJson(configPath, config, { spaces: 2 });

    console.log("✅ Removed plugin from:");
    console.log(`   ${configPath}`);
  });

program
  .command("status")
  .description("Show current global/project hybrid-arch files")
  .option("--project <dir>", "Project directory", process.cwd())
  .action(async (opts) => {
    const projectDir = path.resolve(opts.project);
    const globalConfigPath = path.join(os.homedir(), ".config", "opencode", "hybrid-arch.json");
    const projectConfigPath = path.join(projectDir, ".opencode", "hybrid-arch.json");
    const lockPath = path.join(projectDir, "skills.lock.json");
    const cmdDir = path.join(projectDir, ".opencode", "commands");
    const skillsDir = path.join(projectDir, ".opencode", "skills");

    console.log("Hybrid Arch Status\n");
    console.log(`Global config: ${globalConfigPath} ${await fs.pathExists(globalConfigPath) ? "✅" : "❌"}`);
    console.log(`Project config: ${projectConfigPath} ${await fs.pathExists(projectConfigPath) ? "✅" : "❌"}`);
    console.log(`skills.lock.json: ${lockPath} ${await fs.pathExists(lockPath) ? "✅" : "❌"}`);
    console.log(`commands dir: ${cmdDir} ${await fs.pathExists(cmdDir) ? "✅" : "❌"}`);
    console.log(`skills dir: ${skillsDir} ${await fs.pathExists(skillsDir) ? "✅" : "❌"}`);
  });

program.parseAsync().catch((err) => {
  console.error(err);
  process.exit(1);
});
