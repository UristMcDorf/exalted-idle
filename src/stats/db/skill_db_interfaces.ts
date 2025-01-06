import { Ability } from "../abilities.js";
import { Attribute } from "../attributes.js";
import { PerkType } from "../perks.js";

export interface PerkDBEntry
{
    type: PerkType;

    // for PerkType.Unique, .Flag
    id?: string;

    // for PerkType.AttributeUp
    attribute?: Attribute;
    amount?: number;
}

export interface SkillDBEntry
{
    id: string;
    ability: Ability;
    maxLevel: number;
    baseXpPerLevel: number;
    xpScaling: number;
    perks: Map<number, PerkDBEntry[]>;
}