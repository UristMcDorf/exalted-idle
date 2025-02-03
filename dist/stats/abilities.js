// basically super categories for skills
// in fact was called super skill at first
// but then I decided to stick to the source material
import { S_localisationManager } from "../main.js";
export var Ability;
(function (Ability) {
    Ability["Athletics"] = "athletics";
    Ability["Awareness"] = "awareness";
    Ability["Craft"] = "craft";
    Ability["Embassy"] = "embassy";
    Ability["Integrity"] = "integrity";
    Ability["Navigate"] = "navigate";
    Ability["Performance"] = "performance";
    Ability["Physique"] = "physique";
    Ability["Presence"] = "presence";
    Ability["Sagacity"] = "sagacity";
    Ability["Stealth"] = "stealth";
    Ability["War"] = "war";
    Ability["CloseCombat"] = "closecombat";
    Ability["RangedCombat"] = "rangedcombat";
    Ability["MartialArts"] = "martialarts";
    Ability["Sorcery"] = "sorcery";
})(Ability || (Ability = {}));
export class AbilityContainer {
    constructor(ability) {
        this.ability = ability;
        this.skills = new Set();
        this.H_container = this.makeContainer();
    }
    makeContainer() {
        let container = document.createElement("details");
        container.id = `ability_container.${this.ability}`;
        container.className = "ability_container bottom_border";
        let label = document.createElement("summary");
        label.id = `ability_container.label.${this.ability}`;
        label.className = "ability_container_label";
        label.innerHTML = S_localisationManager.getString(`ability.${this.ability}.name`);
        container.appendChild(label);
        container.open = true;
        container.style.display = "none"; // initialise invisible due to no skills
        return container;
    }
    shouldBeVisible() {
        // if even one skill present then the ability is visible
        for (const skill of this.skills) {
            if (skill.shouldBeVisible())
                return true;
        }
        return false;
    }
    updateVisibility() {
        this.H_container.style.display = this.shouldBeVisible() ? "block" : "none";
    }
}
