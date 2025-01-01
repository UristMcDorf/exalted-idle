// lmao worked on this for a while then realised spending and exhaustion's not good for an idler until I get the schedules working
// so some of the display doesn't really matter atm
import { S_characterStateManager } from "../../main.js";
import { LocationEffect, LocationEffectType } from "./location_effects.js";
export class LocationEffectAdjustResourcesFlat extends LocationEffect {
    constructor(visible, resources) {
        super(visible);
        this.type = LocationEffectType.AdjustResourcesFlat;
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
        this.H_locationEffectDisplay.innerHTML = `${displayResourcesSpending.slice(0, -2)} per second.`;
    }
    allowContinue() {
        return !this.isExhausted();
    }
    isExhausted() {
        for (const [key, value] of this.resourcesList) {
            if (!S_characterStateManager.canAdjustResource(key, value))
                return true;
        }
        return false;
    }
}
