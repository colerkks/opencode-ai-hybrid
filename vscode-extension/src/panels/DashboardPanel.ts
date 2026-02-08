import * as vscode from 'vscode';
import * as path from 'path';
import { ArchStatus } from '../types';

export class DashboardPanel {
    public static currentPanel: DashboardPanel | undefined;
    public static readonly viewType = 'hybridArchDashboard';
    
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];
    private static _status: ArchStatus | undefined;

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it
        if (DashboardPanel.currentPanel) {
            DashboardPanel.currentPanel._panel.reveal(column);
            return;
        }

        // Otherwise, create a new panel
        const panel = vscode.window.createWebviewPanel(
            DashboardPanel.viewType,
            'Hybrid Architecture Dashboard',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
            }
        );

        DashboardPanel.currentPanel = new DashboardPanel(panel, extensionUri);
    }

    public static updateStatus(status: ArchStatus) {
        DashboardPanel._status = status;
        if (DashboardPanel.currentPanel) {
            DashboardPanel.currentPanel._update();
        }
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // Set the webview's initial html content
        this._update();

        // Listen for when the panel is disposed
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(
            e => {
                if (this._panel.visible) {
                    this._update();
                }
            },
            null,
            this._disposables
        );

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'refresh':
                        vscode.commands.executeCommand('hybridArch.reload');
                        return;
                    case 'init':
                        vscode.commands.executeCommand('hybridArch.init');
                        return;
                    case 'installSkill':
                        vscode.commands.executeCommand('hybridArch.installSkill');
                        return;
                    case 'openSkill':
                        if (message.path) {
                            vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(message.path), true);
                        }
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public dispose() {
        DashboardPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        const status = DashboardPanel._status;
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hybrid Architecture Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .header h1 {
            font-size: 24px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .header .icon {
            font-size: 28px;
        }

        .actions {
            display: flex;
            gap: 10px;
        }

        button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            cursor: pointer;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: opacity 0.2s;
        }

        button:hover {
            opacity: 0.9;
        }

        button.secondary {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }

        .layers-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .layer-card {
            background-color: var(--vscode-editor-inactiveSelectionBackground);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 20px;
            transition: border-color 0.2s;
        }

        .layer-card:hover {
            border-color: var(--vscode-focusBorder);
        }

        .layer-card.global {
            border-left: 4px solid #4CAF50;
        }

        .layer-card.skill {
            border-left: 4px solid #2196F3;
        }

        .layer-card.project {
            border-left: 4px solid #FF9800;
        }

        .layer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .layer-title {
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .layer-badge {
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
        }

        .layer-path {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 15px;
            word-break: break-all;
            font-family: var(--vscode-editor-font-family);
        }

        .skills-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .skill-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background-color: var(--vscode-editor-background);
            border-radius: 4px;
            border: 1px solid var(--vscode-panel-border);
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .skill-item:hover {
            background-color: var(--vscode-list-hoverBackground);
        }

        .skill-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .skill-name {
            font-weight: 500;
            font-size: 13px;
        }

        .skill-desc {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
        }

        .skill-version {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            background-color: var(--vscode-badge-background);
            padding: 2px 6px;
            border-radius: 4px;
        }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: var(--vscode-descriptionForeground);
        }

        .empty-state .icon {
            font-size: 48px;
            margin-bottom: 15px;
            opacity: 0.5;
        }

        .stats-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }

        .stat-card {
            background-color: var(--vscode-editor-inactiveSelectionBackground);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }

        .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: var(--vscode-foreground);
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .section-title {
            font-size: 14px;
            font-weight: 600;
            margin: 20px 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .no-project {
            text-align: center;
            padding: 60px 20px;
        }

        .no-project h2 {
            margin-bottom: 15px;
        }

        .no-project p {
            margin-bottom: 25px;
            color: var(--vscode-descriptionForeground);
        }

        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            font-size: 14px;
            color: var(--vscode-descriptionForeground);
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .loading {
            animation: pulse 1.5s ease-in-out infinite;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>
            <span class="icon">🏗️</span>
            Hybrid Architecture Dashboard
        </h1>
        <div class="actions">
            <button class="secondary" onclick="refresh()">
                <span>🔄</span> Reload
            </button>
            <button onclick="installSkill()">
                <span>⬇️</span> Install Skill
            </button>
        </div>
    </div>

    ${status ? this._renderStatus(status) : this._renderLoading()}

    <script>
        const vscode = acquireVsCodeApi();

        function refresh() {
            vscode.postMessage({ command: 'refresh' });
        }

        function init() {
            vscode.postMessage({ command: 'init' });
        }

        function installSkill() {
            vscode.postMessage({ command: 'installSkill' });
        }

        function openSkill(path) {
            vscode.postMessage({ command: 'openSkill', path });
        }

        // Listen for messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            if (message.type === 'update') {
                // Reload the page to show updated content
                location.reload();
            }
        });
    </script>
</body>
</html>`;
    }

    private _renderLoading(): string {
        return `
            <div class="loading">
                Loading architecture status...
            </div>
        `;
    }

    private _renderStatus(status: ArchStatus): string {
        const totalSkills = status.global.skills.length + status.skill.skills.length + status.project.skills.length;
        
        return `
            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-value">${status.global.skills.length}</div>
                    <div class="stat-label">Global Skills</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${status.skill.skills.length}</div>
                    <div class="stat-label">Skill Layer</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${status.project.skills.length}</div>
                    <div class="stat-label">Project Skills</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalSkills}</div>
                    <div class="stat-label">Total</div>
                </div>
            </div>

            <div class="layers-container">
                ${this._renderLayer('Global Layer', status.global, 'global', '🌍')}
                ${this._renderLayer('Skill Layer', status.skill, 'skill', '📦')}
                ${this._renderLayer('Project Layer', status.project, 'project', '📁')}
            </div>
        `;
    }

    private _renderLayer(title: string, layer: { path: string; skills: any[] }, type: string, icon: string): string {
        const skillsHtml = layer.skills.length > 0
            ? layer.skills.map(skill => `
                <div class="skill-item" onclick="openSkill('${skill.path}')">
                    <div class="skill-info">
                        <div class="skill-name">${skill.name}</div>
                        ${skill.description ? `<div class="skill-desc">${skill.description}</div>` : ''}
                    </div>
                    <div class="skill-version">v${skill.version}</div>
                </div>
            `).join('')
            : `<div class="empty-state">
                <div class="icon">📭</div>
                <div>No skills installed</div>
            </div>`;

        return `
            <div class="layer-card ${type}">
                <div class="layer-header">
                    <div class="layer-title">
                        <span>${icon}</span>
                        ${title}
                    </div>
                    <div class="layer-badge">${layer.skills.length}</div>
                </div>
                <div class="layer-path">${layer.path}</div>
                <div class="skills-list">
                    ${skillsHtml}
                </div>
            </div>
        `;
    }
}
