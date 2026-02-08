import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'child_process';
import * as util from 'util';
import { DashboardPanel } from './panels/DashboardPanel';
import { HybridArchProvider } from './providers/HybridArchProvider';
import { ConfigManager } from './core/ConfigManager';
import { ArchStatus } from './types';

const exec = util.promisify(cp.exec);

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    console.log('Hybrid Architecture extension is now active');

    // Initialize status bar
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.command = 'hybridArch.showDashboard';
    context.subscriptions.push(statusBarItem);

    // Check if workspace has hybrid architecture
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        checkHybridArchWorkspace(workspaceFolders[0].uri.fsPath);
    }

    // Watch for configuration changes
    const configWatcher = vscode.workspace.createFileSystemWatcher('**/.opencode/hybrid-arch.json');
    configWatcher.onDidChange(() => refreshStatus());
    configWatcher.onDidCreate(() => refreshStatus());
    context.subscriptions.push(configWatcher);

    // Register tree data provider
    const hybridArchProvider = new HybridArchProvider();
    vscode.window.registerTreeDataProvider('hybridArchExplorer', hybridArchProvider);

    // Register commands
    const showDashboardCmd = vscode.commands.registerCommand('hybridArch.showDashboard', () => {
        DashboardPanel.createOrShow(context.extensionUri);
    });

    const initCmd = vscode.commands.registerCommand('hybridArch.init', async () => {
        await initializeProject();
    });

    const statusCmd = vscode.commands.registerCommand('hybridArch.status', async () => {
        await showStatus();
    });

    const reloadCmd = vscode.commands.registerCommand('hybridArch.reload', async () => {
        await reloadConfiguration();
    });

    const installSkillCmd = vscode.commands.registerCommand('hybridArch.installSkill', async () => {
        await installSkill();
    });

    const openSkillCmd = vscode.commands.registerCommand('hybridArch.openSkill', (skill) => {
        if (skill && skill.path) {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.file(skill.path));
        }
    });

    const refreshExplorerCmd = vscode.commands.registerCommand('hybridArch.refreshExplorer', () => {
        hybridArchProvider.refresh();
    });

    const editGlobalConfigCmd = vscode.commands.registerCommand('hybridArch.editGlobalConfig', async () => {
        const configManager = new ConfigManager();
        const globalPath = configManager.getGlobalConfigPath();
        const agentsMdPath = path.join(globalPath, 'AGENTS.md');
        
        if (fs.existsSync(agentsMdPath)) {
            const doc = await vscode.workspace.openTextDocument(agentsMdPath);
            await vscode.window.showTextDocument(doc);
        } else {
            vscode.window.showErrorMessage(`Global configuration not found at ${agentsMdPath}`);
        }
    });

    const editProjectConfigCmd = vscode.commands.registerCommand('hybridArch.editProjectConfig', async () => {
        const configManager = new ConfigManager();
        const projectPath = configManager.getProjectConfigPath();
        if (!projectPath) {
             vscode.window.showErrorMessage('No project open');
             return;
        }
        const agentsMdPath = path.join(path.dirname(projectPath), 'AGENTS.md');
        
        if (fs.existsSync(agentsMdPath)) {
            const doc = await vscode.workspace.openTextDocument(agentsMdPath);
            await vscode.window.showTextDocument(doc);
        } else {
             vscode.window.showErrorMessage(`Project configuration not found at ${agentsMdPath}`);
        }
    });

    // Add all commands to subscriptions
    context.subscriptions.push(
        showDashboardCmd,
        initCmd,
        statusCmd,
        reloadCmd,
        installSkillCmd,
        openSkillCmd,
        refreshExplorerCmd,
        editGlobalConfigCmd,
        editProjectConfigCmd
    );

    // Initial status refresh
    refreshStatus();
}

export function deactivate() {
    // Cleanup
}

async function checkHybridArchWorkspace(workspacePath: string): Promise<void> {
    const configPath = path.join(workspacePath, '.opencode', 'hybrid-arch.json');
    const hasConfig = fs.existsSync(configPath);
    
    vscode.commands.executeCommand('setContext', 'workspaceHasHybridArch', hasConfig);
    
    if (hasConfig) {
        refreshStatus();
    }
}

async function refreshStatus(): Promise<void> {
    try {
        const configManager = new ConfigManager();
        const status = await configManager.getStatus();
        
        updateStatusBar(status);
        
        // Update dashboard if visible
        DashboardPanel.updateStatus(status);
    } catch (error) {
        console.error('Failed to refresh status:', error);
    }
}

function updateStatusBar(status: ArchStatus): void {
    const totalSkills = status.global.skills.length + status.skill.skills.length + status.project.skills.length;
    
    if (totalSkills > 0) {
        statusBarItem.text = `$(layers) Hybrid Arch: ${totalSkills} skills`;
        statusBarItem.tooltip = `Global: ${status.global.skills.length}, Skill: ${status.skill.skills.length}, Project: ${status.project.skills.length}`;
        statusBarItem.show();
    } else {
        statusBarItem.text = `$(layers) Hybrid Arch`;
        statusBarItem.tooltip = 'No skills loaded';
        statusBarItem.show();
    }
}

async function initializeProject(): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;
    const opencodeDir = path.join(workspacePath, '.opencode');
    const hybridArchPath = path.join(opencodeDir, 'hybrid-arch.json');

    if (fs.existsSync(hybridArchPath)) {
        const overwrite = await vscode.window.showWarningMessage(
            'Hybrid architecture already initialized. Overwrite?',
            'Yes', 'No'
        );
        if (overwrite !== 'Yes') {
            return;
        }
    }

    try {
        // Create .opencode directory
        if (!fs.existsSync(opencodeDir)) {
            fs.mkdirSync(opencodeDir, { recursive: true });
        }

        // Create skills directory
        const skillsDir = path.join(opencodeDir, 'skills');
        if (!fs.existsSync(skillsDir)) {
            fs.mkdirSync(skillsDir, { recursive: true });
        }

        // Create commands directory
        const commandsDir = path.join(opencodeDir, 'commands');
        if (!fs.existsSync(commandsDir)) {
            fs.mkdirSync(commandsDir, { recursive: true });
        }

        // Create initial hybrid-arch.json
        const initialConfig = {
            version: '1.0.0',
            project: {
                name: path.basename(workspacePath),
                description: '',
            },
            sources: [],
            skills: {
                installed: [],
                autoLoad: true
            },
            commands: {
                autoRegister: true
            }
        };

        fs.writeFileSync(hybridArchPath, JSON.stringify(initialConfig, null, 2));

        // Create AGENTS.md template
        const agentsMdPath = path.join(workspacePath, 'AGENTS.md');
        if (!fs.existsSync(agentsMdPath)) {
            const agentsMdContent = `# AGENTS.md - Project Configuration

> This file contains project-specific instructions for AI agents.

## Project Overview
- **Name**: ${path.basename(workspacePath)}
- **Created**: ${new Date().toISOString().split('T')[0]}

## Coding Standards
- Use TypeScript strict mode
- Follow existing code patterns
- Write tests for new features

## Architecture
<!-- Describe your project architecture here -->

## Common Tasks
<!-- Document common development tasks -->

---
*Generated by Hybrid Architecture extension*
`;
            fs.writeFileSync(agentsMdPath, agentsMdContent);
        }

        vscode.window.showInformationMessage('✅ Project initialized successfully!');
        vscode.commands.executeCommand('setContext', 'workspaceHasHybridArch', true);
        refreshStatus();

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to initialize: ${error}`);
    }
}

async function showStatus(): Promise<void> {
    try {
        const configManager = new ConfigManager();
        const status = await configManager.getStatus();

        const message = `
**Global Layer**: ${status.global.skills.length} skills
**Skill Layer**: ${status.skill.skills.length} skills  
**Project Layer**: ${status.project.skills.length} skills

**Total Sources**: ${status.sources.length}
        `.trim();

        const selection = await vscode.window.showInformationMessage(
            message,
            { modal: false },
            'Open Dashboard', 'Reload'
        );

        if (selection === 'Open Dashboard') {
            vscode.commands.executeCommand('hybridArch.showDashboard');
        } else if (selection === 'Reload') {
            vscode.commands.executeCommand('hybridArch.reload');
        }

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to get status: ${error}`);
    }
}

async function reloadConfiguration(): Promise<void> {
    try {
        const configManager = new ConfigManager();
        await configManager.reload();
        await refreshStatus();
        vscode.window.showInformationMessage('🔄 Configuration reloaded');
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to reload: ${error}`);
    }
}

async function installSkill(): Promise<void> {
    const skillName = await vscode.window.showInputBox({
        prompt: 'Enter skill name or GitHub repo (e.g., owner/repo)',
        placeHolder: 'myusername/my-skill'
    });

    if (!skillName) {
        return;
    }

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Installing skill: ${skillName}`,
        cancellable: false
    }, async (progress) => {
        try {
            progress.report({ increment: 10, message: 'Running npx skills add...' });
            
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                throw new Error('No workspace open');
            }
            const cwd = workspaceFolders[0].uri.fsPath;

            // Execute the command
            // We use npx to execute the skills CLI
            await exec(`npx skills add ${skillName}`, { cwd });
            
            progress.report({ increment: 100, message: 'Done!' });

            vscode.window.showInformationMessage(`✅ Skill "${skillName}" installed successfully!`);
            refreshStatus();
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to install skill: ${error}`);
        }
    });
}
