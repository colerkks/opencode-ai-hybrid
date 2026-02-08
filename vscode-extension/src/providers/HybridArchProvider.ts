import * as vscode from 'vscode';
import * as path from 'path';
import { ConfigManager } from '../core/ConfigManager';
import { Skill } from '../types';

export class HybridArchProvider implements vscode.TreeDataProvider<SkillTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<SkillTreeItem | undefined | null | void> = new vscode.EventEmitter<SkillTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<SkillTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor() {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: SkillTreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: SkillTreeItem): Promise<SkillTreeItem[]> {
        if (!element) {
            // Root level - show layers
            return [
                new LayerTreeItem('Global Layer', 'global', vscode.TreeItemCollapsibleState.Collapsed),
                new LayerTreeItem('Skill Layer', 'skill', vscode.TreeItemCollapsibleState.Collapsed),
                new LayerTreeItem('Project Layer', 'project', vscode.TreeItemCollapsibleState.Collapsed),
            ];
        }

        if (element instanceof LayerTreeItem) {
            // Load skills for this layer
            const configManager = new ConfigManager();
            const status = await configManager.getStatus();
            
            let skills: Skill[] = [];
            switch (element.layerType) {
                case 'global':
                    skills = status.global.skills;
                    break;
                case 'skill':
                    skills = status.skill.skills;
                    break;
                case 'project':
                    skills = status.project.skills;
                    break;
            }

            if (skills.length === 0) {
                return [new EmptyTreeItem('No skills installed')];
            }

            return skills.map(skill => new SkillTreeItem(
                skill.name,
                skill.description || 'No description',
                skill.version,
                skill.path,
                skill.type,
                vscode.TreeItemCollapsibleState.None
            ));
        }

        return [];
    }
}

export class SkillTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly description: string,
        public readonly version: string,
        public readonly path: string,
        public readonly type: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        
        this.tooltip = `${this.label} (${this.version})\n${this.description}\n${this.path}`;
        this.description = `v${this.version}`;
        this.contextValue = 'skill';
        
        // Set icon based on layer type
        switch (type) {
            case 'global':
                this.iconPath = new vscode.ThemeIcon('globe');
                break;
            case 'skill':
                this.iconPath = new vscode.ThemeIcon('package');
                break;
            case 'project':
                this.iconPath = new vscode.ThemeIcon('folder');
                break;
            default:
                this.iconPath = new vscode.ThemeIcon('symbol-misc');
        }

        this.command = {
            command: 'hybridArch.openSkill',
            title: 'Open Skill',
            arguments: [{ path: this.path }]
        };
    }
}

export class LayerTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly layerType: 'global' | 'skill' | 'project',
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        
        this.contextValue = 'layer';
        
        switch (layerType) {
            case 'global':
                this.iconPath = new vscode.ThemeIcon('globe', new vscode.ThemeColor('charts.green'));
                this.tooltip = 'Global layer: ~/.config/opencode/';
                break;
            case 'skill':
                this.iconPath = new vscode.ThemeIcon('package', new vscode.ThemeColor('charts.blue'));
                this.tooltip = 'Skill layer: ~/.opencode/skills/';
                break;
            case 'project':
                this.iconPath = new vscode.ThemeIcon('folder', new vscode.ThemeColor('charts.orange'));
                this.tooltip = 'Project layer: ./.opencode/';
                break;
        }
    }
}

export class EmptyTreeItem extends vscode.TreeItem {
    constructor(message: string) {
        super(message, vscode.TreeItemCollapsibleState.None);
        this.iconPath = new vscode.ThemeIcon('info');
    }
}
