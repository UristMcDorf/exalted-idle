import { saveLoadAbleList, updatesList } from "./main.js";
import { ProgressBar } from "./progress_bar.js";
import { Utils } from "./utils.js";
export var ResourceType;
(function (ResourceType) {
    ResourceType["Health"] = "health";
    ResourceType["Vigour"] = "vigour";
    ResourceType["Essence"] = "essence";
})(ResourceType || (ResourceType = {}));
class Resource {
    constructor(value, minValue, maxValue, baseRegen, progressBar) {
        this.value = value;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.baseRegen = baseRegen;
        this.regenModifiers = new Set();
        this.progressBar = progressBar;
    }
    // returns false if it couldn't adjust
    adjust(amount, clampToBounds = true) {
        const adjustedValue = this.value + amount;
        const outOfBounds = adjustedValue < this.minValue || adjustedValue > this.maxValue;
        if (outOfBounds && !clampToBounds)
            return false;
        this.value = Utils.clamp(adjustedValue, this.minValue, this.maxValue);
        this.progressBar.setValue(this.value);
        return true;
    }
    canAdjust(amount) {
        const adjustedValue = this.value + amount;
        return adjustedValue >= this.minValue && adjustedValue <= this.maxValue;
    }
    regen(times) {
        let totalRegen = this.baseRegen;
        // should I really iterate over them every tick?
        // I don't think it's too expensive, but maybe a robust system of adjustments when necessary is better
        for (const regenModifier of this.regenModifiers) {
            totalRegen *= regenModifier.multiplier;
        }
        this.adjust(totalRegen * times);
    }
    registerModifier(regenModifier) {
        this.regenModifiers.add(regenModifier);
    }
    unregisterModifier(regenModifier) {
        this.regenModifiers.delete(regenModifier);
    }
    updateDisplay() {
        this.progressBar.update();
    }
}
export class CharacterStateManager {
    constructor() {
        // ISaveLoadAble implementation block
        this.saveId = "character_state";
        this.resources = new Map([
            [ResourceType.Health, new Resource(100, 0, 100, 0.1, new ProgressBar(ResourceType.Health, 100, 100))],
            [ResourceType.Vigour, new Resource(100, 0, 100, 1, new ProgressBar(ResourceType.Vigour, 100, 100))]
        ]);
        saveLoadAbleList.add(this);
        updatesList.add(this);
    }
    update(minutesPassed) {
        for (const [key, value] of this.resources) {
            value.regen(minutesPassed);
        }
    }
    adjustResource(type, amount, clampToBounds = true) {
        this.resources.get(type).adjust(amount, clampToBounds);
    }
    canAdjustResource(type, amount) {
        return this.resources.get(type).canAdjust(amount);
    }
    registerModifier(resource, regenModifier) {
        this.resources.get(resource).regenModifiers.add(regenModifier);
    }
    unregisterModifier(resource, regenModifier) {
        this.resources.get(resource).regenModifiers.delete(regenModifier);
    }
    save() {
        let data = "";
        for (const [key, value] of this.resources.entries()) {
            data += `"${key}":${value.value},`;
        }
        return `{${data.slice(0, -1)}}`;
    }
    load(data) {
        let returnValue = true;
        for (const [key, value] of Object.entries(data)) {
            let resource = this.resources.get(key);
            if (resource === undefined) {
                console.error(`Failed to load resource: ${key}`);
                returnValue = false;
                continue;
            }
            resource.value = value;
        }
        this.updateDisplay();
        return returnValue;
    }
    updateDisplay() {
        for (const [key, value] of this.resources) {
            value.updateDisplay();
        }
    }
}
