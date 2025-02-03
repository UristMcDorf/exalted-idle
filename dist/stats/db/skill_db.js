// TODO: also move to YAML!
import { Ability } from "../abilities.js";
import { Attribute } from "../attributes.js";
import { PerkType } from "../perks.js";
// there's probably a better way to do this
// but it's transitory before YAML anyway
export const DB_Skill = new Set([
    { id: "sleeping", ability: Ability.Integrity, maxLevel: 10, baseXpPerLevel: 100, xpScaling: 1.5, perks: new Map() },
    { id: "farming", ability: Ability.Physique, maxLevel: 10, baseXpPerLevel: 100, xpScaling: 1.5, perks: new Map() },
    { id: "toughness", ability: Ability.Physique, maxLevel: 10, baseXpPerLevel: 100, xpScaling: 1.5, perks: new Map() },
    { id: "timekeeping", ability: Ability.Sagacity, maxLevel: 10, baseXpPerLevel: 7200, xpScaling: 1.5, perks: new Map([
            [1, [{ type: PerkType.Unique, id: "time_display" }]],
            [2, [{ type: PerkType.AttributeUp, attribute: Attribute.Intelligence, amount: 1 }]],
            [3, [{ type: PerkType.Unique, id: "dayofweek_display" }]],
            [4, [{ type: PerkType.AttributeUp, attribute: Attribute.Perception, amount: 1 }]],
            [5, [{ type: PerkType.Unique, id: "month_display" }]],
            [6, [{ type: PerkType.AttributeUp, attribute: Attribute.Wits, amount: 1 }]],
            [7, [{ type: PerkType.Unique, id: "dayofmonth_display" }]],
            [8, [{ type: PerkType.AttributeUp, attribute: Attribute.Perception, amount: 1 }]],
            [9, [{ type: PerkType.AttributeUp, attribute: Attribute.Wits, amount: 1 }]],
            [10, [{ type: PerkType.Unique, id: "year_display" }, { type: PerkType.AttributeUp, attribute: Attribute.Intelligence, amount: 1 }]]
        ]) },
]);
