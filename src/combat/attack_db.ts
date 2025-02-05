import { Weighted } from "../utils.js";

export interface AttackDBEntry
{
    id: string;

    baseAttackSpeed: number;
    baseAttackPower: number;
}

export const AttackDB: Map<string, AttackDBEntry> = new Map<string, AttackDBEntry>([
    [ "claw", { id: "claw", baseAttackSpeed: 1, baseAttackPower: 5 } ],
    [ "bite", { id: "bite", baseAttackSpeed: 1, baseAttackPower: 10 } ]
])