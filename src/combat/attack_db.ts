import { Weighted } from "../utils.js";

export interface AttackDBEntry
{
    id: string;

    baseAttackSpeed: number;
    baseAttackAccuracy: number;
    baseAttackPower: number;
}

export const DB_Attack: Map<string, AttackDBEntry> = new Map<string, AttackDBEntry>([
    [ "claw", { id: "claw", baseAttackSpeed: 1, baseAttackAccuracy: 1, baseAttackPower: 5 } ],
    [ "bite", { id: "bite", baseAttackSpeed: 1, baseAttackAccuracy: 0.8, baseAttackPower: 10 } ]
])