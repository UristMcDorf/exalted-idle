// basically categories for skills
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
        this.skills = [];
        this.collapsed = false;
        this.makeContainer();
    }
    // if this gets called, we already have at least one visible skill because otherwise it's not getting clicked
    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        for (let i = 0; i < this.skills.length; i++) {
            this.skills[i].updateVisibility();
        }
    }
    makeContainer() {
        let container = document.createElement("div");
        container.id = "ability_container." + this.ability;
        container.className = "ability_container";
        let labelDiv = document.createElement("div");
        labelDiv.id = "ability_container.label." + this.ability;
        labelDiv.className = "ability_container_label";
        labelDiv.innerHTML = S_localisationManager.getString("ability." + this.ability);
        container.appendChild(labelDiv);
        container.style.display = "none"; // initialise invisible due to no skills
        this.H_container = container;
        this.H_container.addEventListener("click", evt => this.toggleCollapsed());
    }
    shouldBeVisible() {
        for (let i = 0; i < this.skills.length; i++) {
            if (this.skills[i].shouldBeVisible())
                return true;
        }
        return false;
    }
    updateVisibility() {
        this.H_container.style.display = this.shouldBeVisible() ? "block" : "none";
    }
}
