import { S_statManager, S_localisationManager } from "../../main.js";
import { LocationEffect, LocationEffectType } from "./location_effects.js";
export class LocationEffectSkillGain extends LocationEffect {
    constructor(visible, skillName, amountPerTick) {
        super(visible);
        this.type = LocationEffectType.SkillGain;
        //this.H_locationEffectDisplay = document.getElementById("location_effect_display.skill_gain")!
        this.skillName = skillName;
        this.amountPerTick = amountPerTick;
    }
    onEnter() {
        this.updateDisplay();
    }
    update() {
        S_statManager.gainSkill(this.skillName, this.amountPerTick);
        this.updateDisplay();
    }
    updateDisplay() {
        if (!this.visible)
            return;
        const skillDisplay = S_statManager.skillList.get(this.skillName).shouldBeVisible() ? S_localisationManager.getString(`skill.${this.skillName}.name`) : "???";
        this.H_locationEffectDisplay.innerHTML = `${this.amountPerTick} ${skillDisplay} skill xp per minute.`;
    }
}
