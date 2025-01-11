// largely copies settings manager
import { S_displayManager, S_localisationManager, S_statManager } from "./main.js";
// Allowing myself some spaghetti fuckin' code here
export class DebugManager {
    constructor() {
        this.debugFlag = true;
        this.debugPanelVisible = false;
        this.H_debugPanel = document.getElementById("debug_panel");
        this.debugFlag ? document.getElementById(`debug_panel_button`).addEventListener("click", evt => this.toggle()) : document.getElementById(`debug_panel_button`).remove();
        this.setupSkillSetter();
    }
    toggle() {
        this.debugPanelVisible = !this.debugPanelVisible;
        this.H_debugPanel.style.display = this.debugPanelVisible ? "block" : "none";
        S_displayManager.toggleScreenTint(this.debugPanelVisible ? this : null);
    }
    // temporary until I move it to settings proper
    static clearSave() {
        localStorage.clear();
    }
    setupSkillSetter() {
        const select = document.getElementById(`debug.skill.select`);
        for (const id of S_statManager.skillList.keys()) {
            const option = document.createElement(`option`);
            option.value = id;
            option.innerHTML = S_localisationManager.getString(`skill.${id}.name`);
            select.appendChild(option);
        }
        document.getElementById(`debug.skill.set.button`).addEventListener(`click`, evt => this.setSkill());
    }
    setSkill() {
        const skill = S_statManager.skillList.get(document.getElementById(`debug.skill.select`).value);
        skill.setXp(skill.xpToSpecificLevel(Number.parseInt(document.getElementById(`debug.skill.select.input`).value)));
    }
}
