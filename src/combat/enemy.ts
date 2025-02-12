import { Weighted } from "../utils.js";
import { DB_Attack, AttackDBEntry } from "./attack_db.js";
import { EnemyDBEntry } from "./enemy_db.js";

class Attack implements Weighted
{
    id: string;

    weight: number;

    attackSpeed: number;
    attackAccuracy: number;
    attackPower: number;

    constructor(weight: number, dbEntry: AttackDBEntry, accuracyFactor: number, powerFactor: number)
    {
        this.id = dbEntry.id;

        this.weight = weight;

        this.attackSpeed = dbEntry.baseAttackSpeed;
        this.attackAccuracy = dbEntry.baseAttackAccuracy * accuracyFactor;
        this.attackPower = dbEntry.baseAttackPower * powerFactor;
    }
}

export class Enemy
{
    id: string;

    health: number;
    defence: number;
    evasion: number;

    attacks: Attack[];

    constructor(dbEntry: EnemyDBEntry)
    {
        this.id = dbEntry.id;

        this.health = dbEntry.health;
        this.defence = dbEntry.defence;
        this.evasion = dbEntry.evasion;

        this.attacks = [];

        for(const dbEntryAttack of dbEntry.attacks)
        {
            this.attacks.push(new Attack(dbEntryAttack.weight, DB_Attack.get(dbEntryAttack.id)!, dbEntry.accuracyFactor, dbEntry.powerFactor));
        }
    }
}