import { S_characterStateManager, S_localisationManager } from "../main.js";
import { PerkDBEntry } from "./db/skill_db_interfaces.js";
import { Skill } from "./skills.js";

export enum PerkType
{
    // these two are functionally equivalent, but flag isn't visible in tooltips
    Unique,
    Flag,

    AttributeUp
}

export class Perk
{
    parent: Skill;
    enabled: boolean;

    constructor(parent: Skill)
    {
        this.parent = parent;
        this.enabled = false;
    }

    static makePerk(dbEntry: PerkDBEntry, skill: Skill): Perk
    {
        switch(dbEntry.type)
        {
            case PerkType.Unique:
                return new PerkFlagUnique(skill, dbEntry.id!, true);
            case PerkType.Flag:
                return new PerkFlagUnique(skill, dbEntry.id!, false);
            case PerkType.AttributeUp:
                // return new PerkFlagUnique(skill, true, dbEntry.id!);
                return new Perk(skill); // DUMMY
        }
    }

    // exist to be extended
    enable(): void { this.enabled = true; }
    desc(): string | null { return null; }
}

export class PerkFlagUnique extends Perk
{
    id: string;
    visible: boolean;

    constructor(parent: Skill, id: string, visible: boolean)
    {
        super(parent);

        this.id = id;
        this.visible = visible;
    }

    enable(): void
    {
        super.enable();

        S_characterStateManager.registerFlag(`${this.parent.id}.${this.id}`);
    }

    desc(): string | null
    {
        return this.visible ? S_localisationManager.getString(`perk.${this.parent.id}.${this.id}`) : null;
    }
}