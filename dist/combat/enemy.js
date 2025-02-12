import { DB_Attack } from "./attack_db.js";
class Attack {
    constructor(weight, dbEntry, accuracyFactor, powerFactor) {
        this.id = dbEntry.id;
        this.weight = weight;
        this.attackSpeed = dbEntry.baseAttackSpeed;
        this.attackAccuracy = dbEntry.baseAttackAccuracy * accuracyFactor;
        this.attackPower = dbEntry.baseAttackPower * powerFactor;
    }
}
export class Enemy {
    constructor(dbEntry) {
        this.id = dbEntry.id;
        this.health = dbEntry.health;
        this.defence = dbEntry.defence;
        this.evasion = dbEntry.evasion;
        this.attacks = [];
        for (const dbEntryAttack of dbEntry.attacks) {
            this.attacks.push(new Attack(dbEntryAttack.weight, DB_Attack.get(dbEntryAttack.id), dbEntry.accuracyFactor, dbEntry.powerFactor));
        }
    }
}
