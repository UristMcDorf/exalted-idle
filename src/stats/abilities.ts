// basically super categories for skills
// in fact was called super skill at first
// but then I decided to stick to the source material

import { S_localisationManager } from "../main.js";
import { Skill } from "./skills.js";

export enum Ability
{
    Archery = "archery",
    Athletics = "athletics",
    Awareness = "awareness",
    Bureaucracy = "bureaucracy",
    Craft = "craft",
    Dodge = "dodge",
    Integrity = "integrity",
    Investigation = "investigation",
    Larceny = "larceny",
    Linguistics = "linguistics",
    Lore = "lore",
    MartialArts = "martialarts", // includes Brawl!
    Medicine = "medicine",
    Melee = "melee",
    Occult = "occult",
    Performance = "performance",
    Presence = "presence",
    Resistance = "resistance",
    Ride = "ride",
    Sail = "sail",
    Socialise = "socialise", // suck it US English
    Stealth = "stealth",
    Survival = "survival",
    Thrown = "thrown",
    War = "war"
}

export class AbilityContainer
{
    H_container!: HTMLDetailsElement;
    
    ability: Ability;
    skills: Set<Skill>;

    constructor(ability: Ability)
    {
        this.ability = ability;
        this.skills = new Set<Skill>();
        
        this.H_container = this.makeContainer();
    }

    makeContainer(): HTMLDetailsElement
    {
        let container: HTMLDetailsElement = document.createElement("details");

        container.id = `ability_container.${this.ability}`;
        container.className = "ability_container bottom_border";

        let label: HTMLElement = document.createElement("summary");

        label.id = `ability_container.label.${this.ability}`;
        label.className = "ability_container_label";
        label.innerHTML = S_localisationManager.getString(`ability.${this.ability}.name`);

        container.appendChild(label);

        container.open = true;

        container.style.display = "none"; // initialise invisible due to no skills

        return container;
    }

    shouldBeVisible(): boolean
    {
        // if even one skill present then the ability is visible

        for(const skill of this.skills)
        {
            if(skill.shouldBeVisible()) return true;
        }

        return false;
    }

    updateVisibility(): void
    {
        this.H_container.style.display = this.shouldBeVisible() ? "block" : "none";
    }
}