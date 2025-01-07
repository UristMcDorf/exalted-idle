import { S_characterStateManager, S_localisationManager, S_statManager } from "../main.js";
export var PerkType;
(function (PerkType) {
    // these two are functionally equivalent, but flag isn't visible in tooltips
    PerkType[PerkType["Unique"] = 0] = "Unique";
    PerkType[PerkType["Flag"] = 1] = "Flag";
    PerkType[PerkType["AttributeUp"] = 2] = "AttributeUp";
})(PerkType || (PerkType = {}));
export class Perk {
    constructor(parent) {
        this.parent = parent;
        this.enabled = false;
    }
    static makePerk(dbEntry, skill) {
        switch (dbEntry.type) {
            case PerkType.Unique:
                return new PerkFlagUnique(skill, dbEntry.id, true);
            case PerkType.Flag:
                return new PerkFlagUnique(skill, dbEntry.id, false);
            case PerkType.AttributeUp:
                return new PerkAttributeUp(skill, dbEntry.attribute, dbEntry.amount); // DUMMY
        }
    }
    // exist to be extended
    enable(loading = false) { this.enabled = true; }
    desc() { return null; }
}
export class PerkFlagUnique extends Perk {
    constructor(parent, id, visible) {
        super(parent);
        this.id = id;
        this.visible = visible;
    }
    enable(loading = false) {
        super.enable(loading);
        S_characterStateManager.registerFlag(`${this.parent.id}.${this.id}`);
    }
    desc() {
        return this.visible ? S_localisationManager.getString(`skill.${this.parent.id}.perk.${this.id}`) : null;
    }
}
export class PerkAttributeUp extends Perk {
    constructor(parent, attribute, flat) {
        super(parent);
        this.attribute = attribute;
        this.flat = flat;
    }
    enable(loading = false) {
        S_statManager.registerAttributeAdjuster(this, !loading);
    }
    desc() {
        return `+${this.flat} ${S_localisationManager.getString(`attribute.${this.attribute}.name`)}`;
    }
}
