import { S_characterStateManager, S_localisationManager, S_statManager } from "../main.js";
import { Attribute, AttributeAdjuster } from "./attributes.js";
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
                return new PerkAttributeUp(skill, dbEntry.attribute!, dbEntry.amount!); // DUMMY
        }
    }

    // exist to be extended
    enable(loading: boolean = false): void { this.enabled = true; }
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

    enable(loading: boolean = false): void
    {
        super.enable(loading);

        S_characterStateManager.registerFlag(`${this.parent.id}.${this.id}`);
    }

    desc(): string | null
    {
        return this.visible ? S_localisationManager.getString(`skill.${this.parent.id}.perk.${this.id}`) : null;
    }
}

export class PerkAttributeUp extends Perk implements AttributeAdjuster
{
    attribute: Attribute;

    flat: number;

    constructor(parent: Skill, attribute: Attribute, flat: number)
    {
        super(parent);

        this.attribute = attribute;
        this.flat = flat;
    }

    enable(loading: boolean = false): void
    {
        S_statManager.registerAttributeAdjuster(this, !loading);
    }

    desc(): string | null
    {
        return `+${this.flat} ${S_localisationManager.getString(`attribute.${this.attribute}.name`)}`
    }
}