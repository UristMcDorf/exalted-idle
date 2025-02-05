import { S_characterStateManager, S_gameTimeManager, S_localisationManager, S_statManager } from "../../main.js";
// TODO: figure out how to split it into files in a way that doesn't make it CaNnOt AcCeSs BeFoRe InItIaLiSaTiOn
export var LocationEffectType;
(function (LocationEffectType) {
    LocationEffectType["TimeMultiplier"] = "time_multiplier";
    LocationEffectType["SkillGain"] = "skill_gain";
    LocationEffectType["AdjustResourcesFlat"] = "adjust_resources_flat";
    LocationEffectType["AdjustResourcesMulti"] = "adjust_resources_multi";
    LocationEffectType["Duel"] = "duel";
    LocationEffectType["Explore"] = "explore";
    LocationEffectType["MassCombat"] = "mass_combat";
    LocationEffectType["NONE"] = "none"; // dummy type for the base LocationEffect class
})(LocationEffectType || (LocationEffectType = {}));
// base class for some default display population functions
export class LocationEffect {
    constructor(visible) {
        this.type = LocationEffectType.NONE;
        this.visible = visible;
        this.H_locationEffectDisplay = visible ? this.createDisplay() : null;
    }
    createDisplay() {
        const H_display = document.createElement("div");
        H_display.className = "top_border";
        return H_display;
    }
    static makeLocationEffect(dbEntry) {
        let locationEffect;
        switch (dbEntry.type) {
            case LocationEffectType.SkillGain:
                locationEffect = new LocationEffectSkillGain(dbEntry.visible, dbEntry.skillGainId, dbEntry.skillGainAmount);
                break;
            case LocationEffectType.AdjustResourcesFlat:
                locationEffect = new LocationEffectAdjustResourcesFlat(dbEntry.visible, dbEntry.adjustResourcesFlatList);
                break;
            case LocationEffectType.AdjustResourcesMulti:
                locationEffect = new LocationEffectAdjustResourcesMulti(dbEntry.visible, dbEntry.adjustResourcesMultiList);
                break;
            case LocationEffectType.TimeMultiplier:
                locationEffect = new LocationEffectTimeMultiplier(dbEntry.visible, dbEntry.timeMultiplier);
                break;
            case LocationEffectType.NONE:
            default:
                console.error(`Trying to create LocationEffect with type "${dbEntry.type}" (none or not implemented yet). Creating dummy LocationEffect.`);
                locationEffect = new LocationEffect(false);
        }
        return locationEffect;
    }
    // default, works for most string-only descriptions in effects
    updateDisplay() {
        if (!this.visible)
            return;
        this.H_locationEffectDisplay.innerHTML = this.descriptionString();
    }
    // these exist to be overriden
    onEnter() { this.updateDisplay(); }
    update(minutesPassed) { this.updateDisplay(); }
    onExit() { this.updateDisplay(); }
    allowContinue() { return true; }
    descriptionString() { return `Location effect description string not implemented for "${this.type}}".`; }
}
export class LocationEffectAdjustResourcesFlat extends LocationEffect {
    constructor(visible, resources) {
        super(visible);
        this.type = LocationEffectType.AdjustResourcesFlat;
        this.resourcesList = resources;
    }
    update(minutesPassed) {
        while (minutesPassed > 0) {
            if (this.isExhausted())
                return; // we're only spending if we can afford it all
            for (const [key, value] of this.resourcesList) {
                S_characterStateManager.adjustResource(key, value);
            }
            minutesPassed--;
        }
        super.update(minutesPassed);
    }
    descriptionString() {
        // TODO: Currently NOT accurate, but since it's not going to be used for now, nbd :D
        if (this.isExhausted()) // TODO: get rid of double call - first in update() then in updateDisplay()
         {
            return `You're exhausted... (no effects)`;
        }
        let displayResourcesSpending = "";
        for (const [key, value] of this.resourcesList) {
            displayResourcesSpending += `${value > 0 ? `+${value}` : value} ${key}, `; // looks like "-1 vigour, " or "+4 health, "
        }
        return `${displayResourcesSpending.slice(0, -2)} per second.`;
    }
    allowContinue() {
        return !this.isExhausted();
    }
    isExhausted() {
        for (const [key, value] of this.resourcesList) {
            if (value < 0 && !S_characterStateManager.canAdjustResource(key, value))
                return true;
        }
        return false;
    }
}
export class LocationEffectAdjustResourcesMulti extends LocationEffect {
    constructor(visible, resources) {
        super(visible);
        this.type = LocationEffectType.AdjustResourcesMulti;
        this.resourcesList = resources;
    }
    onEnter() {
        for (const [key, value] of this.resourcesList) {
            S_characterStateManager.registerModifier(key, value);
        }
        super.onEnter();
    }
    onExit() {
        for (const [key, value] of this.resourcesList) {
            S_characterStateManager.unregisterModifier(key, value);
        }
        super.onExit();
    }
    descriptionString() {
        let displayResourcesSpending = "";
        for (const [key, value] of this.resourcesList) {
            displayResourcesSpending += `x${Math.round(value.multiplier * 100) / 100} ${key} regen, `; // looks like "x0.5 vigour regen, " or "x4 health regen, "
        }
        return `${displayResourcesSpending.slice(0, -2)}`;
    }
}
export class LocationEffectSkillGain extends LocationEffect {
    constructor(visible, skillName, amountPerTick) {
        super(visible);
        this.type = LocationEffectType.SkillGain;
        // this.H_locationEffectDisplay = document.getElementById("location_effect_display.skill_gain")!
        this.skillName = skillName;
        this.amountPerTick = amountPerTick;
    }
    update(minutesPassed) {
        S_statManager.gainSkill(this.skillName, this.amountPerTick * minutesPassed);
        super.update(minutesPassed);
    }
    descriptionString() {
        const skillDisplay = S_statManager.skillList.get(this.skillName).shouldBeVisible() ? S_localisationManager.getString(`skill.${this.skillName}.name`) : "???";
        return `${this.amountPerTick} ${skillDisplay} skill xp per minute.`;
    }
}
export class LocationEffectTimeMultiplier extends LocationEffect {
    constructor(visible, timeMultiplier) {
        super(visible);
        this.type = LocationEffectType.TimeMultiplier;
        this.timeMultiplier = timeMultiplier;
    }
    onEnter() {
        S_gameTimeManager.registerTimeMultiplier(this);
        super.onEnter();
    }
    onExit() {
        S_gameTimeManager.unregisterTimeMultiplier(this);
        super.onExit();
    }
    descriptionString() {
        return `Time flows ${this.timeMultiplier}x ${this.timeMultiplier < 1 ? `slower` : `faster`} here.`;
    }
}
