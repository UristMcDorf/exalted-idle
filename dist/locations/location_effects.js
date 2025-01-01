import { S_characterStateManager, S_localisationManager, S_statManager } from "../main.js";
export var LocationEffectType;
(function (LocationEffectType) {
    LocationEffectType["SkillGain"] = "skill_gain";
    LocationEffectType["TimeMultiplier"] = "time_multiplier";
    LocationEffectType["AdjustResources"] = "adjust_resources";
    LocationEffectType["Regen"] = "regen";
    LocationEffectType["Duel"] = "duel";
    LocationEffectType["ExploreCombat"] = "explore_combat";
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
            case LocationEffectType.AdjustResources:
                locationEffect = new LocationEffectAdjustResources(dbEntry.visible, dbEntry.adjustResourcesList);
                break;
            case LocationEffectType.NONE:
            default:
                console.error(`Trying to create LocationEffect with type "${dbEntry.type}" (none or not implemented yet). Creating dummy LocationEffect.`);
                locationEffect = new LocationEffect(false);
        }
        return locationEffect;
    }
    // these exist to be overriden
    onEnter() { }
    update() { }
    onExit() { }
    allowContinue() { return true; }
}
export class LocationEffectSkillGain extends LocationEffect {
    constructor(visible, skillName, amountPerTick) {
        super(visible);
        this.type = LocationEffectType.SkillGain;
        //this.H_locationEffectDisplay = document.getElementById("location_effect_display.skill_gain")!
        this.skillName = skillName;
        this.amountPerTick = amountPerTick;
    }
    onEnter() {
        this.updateDisplay();
    }
    update() {
        S_statManager.gainSkill(this.skillName, this.amountPerTick);
        this.updateDisplay();
    }
    updateDisplay() {
        if (!this.visible)
            return;
        const skillDisplay = S_statManager.skillList.get(this.skillName).shouldBeVisible() ? S_localisationManager.getString(`skill.${this.skillName}.name`) : "???";
        this.H_locationEffectDisplay.innerHTML = `${this.amountPerTick} ${skillDisplay} skill xp per minute.`;
    }
}
// lmao worked on this for a while then realised spending and exhaustion's not good for an idler until I get the schedules working
// so some of the display doesn't really matter atm
export class LocationEffectAdjustResources extends LocationEffect {
    constructor(visible, resources) {
        super(visible);
        this.type = LocationEffectType.AdjustResources;
        this.resourcesList = resources;
    }
    onEnter() {
        this.updateDisplay();
    }
    update() {
        if (this.isExhausted())
            return; // we're only spending if we can afford it all
        for (const [key, value] of this.resourcesList) {
            S_characterStateManager.adjustResource(key, value);
        }
        this.updateDisplay();
    }
    updateDisplay() {
        if (!this.visible)
            return;
        if (this.isExhausted()) // TODO: get rid of double call - first in update() then in updateDisplay()
         {
            this.H_locationEffectDisplay.innerHTML = `You're exhausted... (no effects)`;
            return;
        }
        let displayResourcesSpending = "";
        for (const [key, value] of this.resourcesList) {
            displayResourcesSpending += `${value > 0 ? `+${value}` : value} ${key}, `; // looks like "-1 vigour, " or "+4 health, "
        }
        displayResourcesSpending = displayResourcesSpending.slice(0, -2);
        this.H_locationEffectDisplay.innerHTML = `${displayResourcesSpending} per second.`;
    }
    allowContinue() {
        return !this.isExhausted();
    }
    isExhausted() {
        for (const [key, value] of this.resourcesList) {
            if (!S_characterStateManager.canAdjust(key, value))
                return true;
        }
        return false;
    }
}
