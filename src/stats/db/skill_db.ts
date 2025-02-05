// TODO: also move to YAML!

import { Ability } from "../abilities.js"
import { Attribute } from "../attributes.js";
import { PerkType } from "../perks.js";
import { PerkDBEntry, SkillDBEntry } from "./skill_db_interfaces.js";

// there's probably a better way to do this
// but it's transitory before YAML anyway
export const DB_Skill: Set<SkillDBEntry> = new Set<SkillDBEntry>([
    { id: "sleeping", ability: Ability.Integrity, maxLevel: 10, baseXpPerLevel: 500, xpScaling: 1.8, perks: new Map<number, PerkDBEntry[]>() },
    { id: "farming", ability: Ability.Physique, maxLevel: 10, baseXpPerLevel: 100, xpScaling: 1.8, perks: new Map<number, PerkDBEntry[]>() },
    { id: "toughness", ability: Ability.Physique, maxLevel: 10, baseXpPerLevel: 100, xpScaling: 1.8, perks: new Map<number, PerkDBEntry[]>() },
    { id: "timekeeping", ability: Ability.Sagacity, maxLevel: 10, baseXpPerLevel: 7200, xpScaling: 1.8, perks: new Map<number, PerkDBEntry[]>([
        [1, [{ type: PerkType.Unique, id: "time_display" }]],
        [2, [{ type: PerkType.AttributeUp, attribute: Attribute.Mental, amount: 1 }]],
        [3, [{ type: PerkType.Unique, id: "dayofweek_display" }]],
        [4, [{ type: PerkType.AttributeUp, attribute: Attribute.Mental, amount: 1 }]],
        [5, [{ type: PerkType.Unique, id: "month_display" }]],
        [6, [{ type: PerkType.AttributeUp, attribute: Attribute.Mental, amount: 1 }]],
        [7, [{ type: PerkType.Unique, id: "dayofmonth_display" }]],
        [8, [{ type: PerkType.AttributeUp, attribute: Attribute.Mental, amount: 1 }]],
        [9, [{ type: PerkType.AttributeUp, attribute: Attribute.Mental, amount: 1 }]],
        [10, [{ type: PerkType.Unique, id: "year_display" }, { type: PerkType.AttributeUp, attribute: Attribute.Mental, amount: 1 }]]
    ]) },
])