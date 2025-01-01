import { LocationEffect, LocationEffectType } from "./location_effects.js";
export class LocationEffectAdjustResourcesMulti extends LocationEffect {
    constructor(visible, resources) {
        super(visible);
        this.type = LocationEffectType.AdjustResourcesMulti;
        this.resourcesList = resources;
    }
    onEnter() {
        this.updateDisplay();
    }
    update() {
        this.updateDisplay();
    }
    updateDisplay() {
        if (!this.visible)
            return;
        let displayResourcesSpending = "";
        for (const [key, value] of this.resourcesList) {
            displayResourcesSpending += `x${value.toPrecision(2)} ${key} regen, `; // looks like "x0.5 vigour regen, " or "x4 health regen, "
        }
        this.H_locationEffectDisplay.innerHTML = `${displayResourcesSpending.slice(0, -2)}`;
    }
}
