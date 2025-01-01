// TODO: also move to YAML!
import { Ability } from "../abilities.js";
// there's probably a better way to do this
// but it's transitory before YAML anyway
export const DB_Skill = new Set([
    { id: "sleeping", ability: Ability.Integrity, maxLevel: 10, baseXpPerLevel: 100, xpScaling: 1.5 },
    { id: "farming", ability: Ability.Resistance, maxLevel: 10, baseXpPerLevel: 100, xpScaling: 1.5 },
    { id: "toughness", ability: Ability.Resistance, maxLevel: 10, baseXpPerLevel: 100, xpScaling: 1.5 },
]);
