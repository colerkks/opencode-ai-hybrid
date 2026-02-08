import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { ArchStatus, HybridArchConfig, Skill } from '../types';

export class ConfigManager {
    private globalConfigPath: string;
    private skillConfigPath: string;
    private projectConfigPath: string;

    constructor() {
        // Global layer
        const homeDir = os.homedir();
        this.globalConfigPath = path.join(homeDir, '.config', 'opencode');
        
        // Skill layer
        this.skillConfigPath = path.join(homeDir, '.opencode', 'skills');
        
        // Project layer (current workspace)
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            this.projectConfigPath = path.join(workspaceFolders[0].uri.fsPath, '.opencode');
        } else {
            this.projectConfigPath = '';
        }
    }

    public getGlobalConfigPath(): string {
        return this.globalConfigPath;
    }

    public getProjectConfigPath(): string {
        return this.projectConfigPath;
    }

    async getStatus(): Promise<ArchStatus> {
        const globalSkills = this.loadSkillsFromPath(this.globalConfigPath, 'global');
        const skillSkills = this.loadSkillsFromPath(this.skillConfigPath, 'skill');
        const projectSkills = this.projectConfigPath 
            ? this.loadSkillsFromPath(this.projectConfigPath, 'project')
            : [];

        return {
            version: '3.1.0',
            global: {
                path: this.globalConfigPath,
                skills: globalSkills,
                sources: []
            },
            skill: {
                path: this.skillConfigPath,
                skills: skillSkills,
                sources: []
            },
            project: {
                path: this.projectConfigPath,
                skills: projectSkills,
                sources: []
            },
            sources: []
        };
    }

    async reload(): Promise<void> {
        // In a real implementation, this would clear caches and reload
        console.log('Reloading configuration...');
    }

    private loadSkillsFromPath(basePath: string, type: 'global' | 'skill' | 'project'): Skill[] {
        const skills: Skill[] = [];
        const skillsDir = path.join(basePath, 'skills');

        if (!fs.existsSync(skillsDir)) {
            return skills;
        }

        try {
            const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
            
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const skillPath = path.join(skillsDir, entry.name);
                    const skill = this.parseSkill(skillPath, entry.name, type);
                    if (skill) {
                        skills.push(skill);
                    }
                }
            }
        } catch (error) {
            console.error(`Error loading skills from ${skillsDir}:`, error);
        }

        return skills;
    }

    private parseSkill(skillPath: string, name: string, type: 'global' | 'skill' | 'project'): Skill | null {
        const skillMdPath = path.join(skillPath, 'SKILL.md');
        
        if (!fs.existsSync(skillMdPath)) {
            return {
                name,
                version: 'unknown',
                path: skillPath,
                type
            };
        }

        try {
            const content = fs.readFileSync(skillMdPath, 'utf-8');
            const frontmatter = this.parseFrontmatter(content);
            
            return {
                name: frontmatter.name || name,
                description: frontmatter.description,
                version: frontmatter.version || 'unknown',
                path: skillPath,
                type
            };
        } catch (error) {
            return {
                name,
                version: 'error',
                path: skillPath,
                type
            };
        }
    }

    private parseFrontmatter(content: string): Record<string, string> {
        const result: Record<string, string> = {};
        
        if (content.startsWith('---')) {
            const endIndex = content.indexOf('---', 3);
            if (endIndex !== -1) {
                const frontmatter = content.substring(3, endIndex).trim();
                const lines = frontmatter.split('\n');
                
                for (const line of lines) {
                    const colonIndex = line.indexOf(':');
                    if (colonIndex !== -1) {
                        const key = line.substring(0, colonIndex).trim();
                        const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
                        result[key] = value;
                    }
                }
            }
        }
        
        return result;
    }
}
