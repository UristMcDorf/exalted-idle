// TODO: also move to YAML!

import { Ability } from "../abilities.js"

export interface SkillDBEntry
{
    id: string;
    ability: Ability;
    maxLevel: number;
    baseXpPerLevel: number;
    xpScaling: number;
}

// there's probably a better way to do this
// but it's transitory before YAML anyway
export const DB_Skill: Set<SkillDBEntry> = new Set<SkillDBEntry>([
    { id: "sleeping", ability: Ability.Integrity, maxLevel: 10, baseXpPerLevel: 100, xpScaling: 1.5 },
    { id: "farming", ability: Ability.Resistance, maxLevel: 10, baseXpPerLevel: 100, xpScaling: 1.5 },
    { id: "toughness", ability: Ability.Resistance, maxLevel: 10, baseXpPerLevel: 100, xpScaling: 1.5 },
])