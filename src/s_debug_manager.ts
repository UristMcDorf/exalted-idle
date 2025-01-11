// largely copies settings manager

import { IScreenTintSource } from "./global_interfaces.js";
import { S_displayManager, S_localisationManager, S_statManager } from "./main.js";
import { Skill } from "./stats/skills.js";

// Allowing myself some spaghetti fuckin' code here
export class DebugManager implements IScreenTintSource
{
    debugFlag: boolean = true;

    H_debugPanel: HTMLElement;

    debugPanelVisible: boolean;

    constructor()
    {
        this.debugPanelVisible = false;

        this.H_debugPanel = document.getElementById("debug_panel")!;
                
        this.debugFlag ? document.getElementById(`debug_panel_button`)!.addEventListener("click", evt => this.toggle()) : document.getElementById(`debug_panel_button`)!.remove();

        this.setupSkillSetter();
    }

    toggle(): void
    {
        this.debugPanelVisible = !this.debugPanelVisible;
        this.H_debugPanel.style.display = this.debugPanelVisible ? "block" : "none";

        S_displayManager.toggleScreenTint(this.debugPanelVisible ? this : null);
    }

    // temporary until I move it to settings proper
    static clearSave(): void
    {
        localStorage.clear();
    }

    setupSkillSetter(): void
    {
        const select: HTMLElement = document.getElementById(`debug.skill.select`)!;

        for(const id of S_statManager.skillList.keys())
        {
            const option: HTMLOptionElement = document.createElement(`option`);

            option.value = id;
            option.innerHTML = S_localisationManager.getString(`skill.${id}.name`);
            select.appendChild(option);
        }

        document.getElementById(`debug.skill.set.button`)!.addEventListener(`click`, evt => this.setSkill());
    }

    setSkill(): void
    {
        const skill: Skill = S_statManager.skillList.get((document.getElementById(`debug.skill.select`)! as HTMLSelectElement).value)!;
        skill.setXp(skill.xpToSpecificLevel(Number.parseInt((document.getElementById(`debug.skill.select.input`)! as HTMLInputElement).value)));
    }
}