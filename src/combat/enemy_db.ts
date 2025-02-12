// obviously many more things later on but for now again

import { WeightedID } from "../utils.js";

// good enough to test the combat system and stuff
export interface EnemyDBEntry
{
    id: string;

    health: number;
    defence: number;
    evasion: number;

    accuracyFactor: number;
    powerFactor: number;

    attacks: WeightedID[];
}

export const DB_Enemy: Map<string, EnemyDBEntry> = new Map<string, EnemyDBEntry>([
    [ "rat", { id: "rat", health: 10, defence: 2, evasion: 0.2, accuracyFactor: 1, powerFactor: 1, attacks: [ { weight: 15, id: "claw" }, { weight: 4, id: "bite" } ] } ],
    [ "eliterat", { id: "eliterat", health: 30, defence: 3, evasion: 0.3, accuracyFactor: 1, powerFactor: 1.5, attacks: [ { weight: 15, id: "claw" }, { weight: 4, id: "bite" } ] } ]
])