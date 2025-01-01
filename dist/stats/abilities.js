// basically super categories for skills
// in fact was called super skill at first
// but then I decided to stick to the source material
import { S_localisationManager } from "../main.js";
export var Ability;
(function (Ability) {
    Ability["Archery"] = "archery";
    Ability["Athletics"] = "athletics";
    Ability["Awareness"] = "awareness";
    Ability["Bureaucracy"] = "bureaucracy";
    Ability["Craft"] = "craft";
    Ability["Dodge"] = "dodge";
    Ability["Integrity"] = "integrity";
    Ability["Investigation"] = "investigation";
    Ability["Larceny"] = "larceny";
    Ability["Linguistics"] = "linguistics";
    Ability["Lore"] = "lore";
    Ability["MartialArts"] = "martialarts";
    Ability["Medicine"] = "medicine";
    Ability["Melee"] = "melee";
    Ability["Occult"] = "occult";
    Ability["Performance"] = "performance";
    Ability["Presence"] = "presence";
    Ability["Resistance"] = "resistance";
    Ability["Ride"] = "ride";
    Ability["Sail"] = "sail";
    Ability["Socialise"] = "socialise";
    Ability["Stealth"] = "stealth";
    Ability["Survival"] = "survival";
    Ability["Thrown"] = "thrown";
    Ability["War"] = "war";
})(Ability || (Ability = {}));
export class AbilityContainer {
    constructor(ability) {
        this.ability = ability;
        this.skills = new Set();
        this.collapsed = false;
        this.H_container = this.makeContainer();
        this.H_container.addEventListener("click", evt => this.toggleCollapsed());
    }
    // if this gets called, we already have at least one visible skill because otherwise it's not getting clicked
    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        for (const skill of this.skills) {
            skill.updateVisibility();
        }
    }
    makeContainer() {
        let container = document.createElement("div");
        container.id = `ability_container.${this.ability}`;
        container.className = "ability_container bottom_border";
        let labelDiv = document.createElement("div");
        labelDiv.id = `ability_container.label.${this.ability}`;
        labelDiv.className = "ability_container_label";
        labelDiv.innerHTML = S_localisationManager.getString(`ability.${this.ability}.name`);
        container.appendChild(labelDiv);
        container.style.display = "none"; // initialise invisible due to no skills
        return container;
    }
    shouldBeVisible() {
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
