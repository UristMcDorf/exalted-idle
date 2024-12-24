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
    H_container!: HTMLDivElement;
    
    ability: Ability;
    skills: Set<Skill>;
    collapsed: boolean;

    constructor(ability: Ability)
    {
        this.ability = ability;
        this.skills = new Set<Skill>();

        this.collapsed = false;
        
        this.H_container = this.makeContainer();

        this.H_container.addEventListener("click", evt => this.toggleCollapsed());
    }

    // if this gets called, we already have at least one visible skill because otherwise it's not getting clicked
    toggleCollapsed(): void
    {
        this.collapsed = !this.collapsed;

        for(const skill of this.skills)
        {
            skill.updateVisibility();
        }
    }

    makeContainer(): HTMLDivElement
    {
        let container: HTMLDivElement = document.createElement("div");

        container.id = `ability_container.${this.ability}`;
        container.className = "ability_container bottom_border";

        let labelDiv: HTMLDivElement = document.createElement("div");

        labelDiv.id = `ability_container.label.${this.ability}`;
        labelDiv.className = "ability_container_label";
        labelDiv.innerHTML = S_localisationManager.getString(`ability.${this.ability}.name`);

        container.appendChild(labelDiv);

        container.style.display = "none"; // initialise invisible due to no skills

        return container;
    }

    shouldBeVisible(): boolean
    {
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