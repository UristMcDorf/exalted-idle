import { saveLoadAbleList, updatesList } from "./main.js";
import { MoneyDisplay } from "./money_display.js";
import { ProgressBar } from "./progress_bar.js";
import { Utils } from "./utils.js";
export var ResourceType;
(function (ResourceType) {
    ResourceType["Health"] = "health";
    ResourceType["Vigour"] = "vigour";
    ResourceType["Essence"] = "essence";
    ResourceType["Money"] = "money";
})(ResourceType || (ResourceType = {}));
const ResourceMaxInfinite = Number.MAX_VALUE;
class Resource {
    constructor(value, minValue, maxValue, baseRegen, progressBar) {
        this.value = value;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.baseRegen = baseRegen;
        this.regenModifiers = new Set();
        if (progressBar !== undefined)
            this.progressBar = progressBar;
    }
    // returns false if it couldn't adjust
    adjust(amount, clampToBounds = true) {
        const adjustedValue = this.value + amount;
        const outOfBounds = adjustedValue < this.minValue || adjustedValue > this.maxValue;
        if (outOfBounds && !clampToBounds)
            return false;
        this.value = Utils.clamp(adjustedValue, this.minValue, this.maxValue);
        this.updateDisplay();
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
        var _a;
        (_a = this.progressBar) === null || _a === void 0 ? void 0 : _a.setValue(this.value);
    }
}
class ResourceMoney extends Resource {
    constructor(value, minValue, maxValue, baseRegen) {
        super(value, minValue, maxValue, baseRegen);
        this.moneyDisplay = new MoneyDisplay(document.getElementById("money_display"), this);
    }
    updateDisplay() {
        this.moneyDisplay.update();
    }
    // IMoneyDisplaySource implementation block
    getMoneyAmount() {
        return this.value;
    }
}
export class CharacterStateManager {
    constructor() {
        // ISaveLoadAble implementation block
        this.saveId = "character_state";
        this.resources = new Map([
            [ResourceType.Health, new Resource(100, 0, 100, 0.1, new ProgressBar(ResourceType.Health, 100, 100))],
            [ResourceType.Vigour, new Resource(100, 0, 100, 1, new ProgressBar(ResourceType.Vigour, 100, 100))],
            [ResourceType.Money, new ResourceMoney(0, 0, ResourceMaxInfinite, 0)]
        ]);
        saveLoadAbleList.add(this);
        updatesList.add(this);
        this.flags = new Set();
    }
    update(minutesPassed) {
        for (const [key, value] of this.resources) {
            value.regen(minutesPassed);
        }
    }
    adjustResource(type, amount, clampToBounds = true) {
        const resource = this.resources.get(type);
        resource.adjust(amount, clampToBounds);
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
    updateDisplay() {
        for (const [key, value] of this.resources) {
            value.updateDisplay();
        }
    }
    // returns false if flag was already there
    registerFlag(flag) {
        if (this.flags.has(flag))
            return false;
        this.flags.add(flag);
        return true;
    }
    hasFlag(flag) {
        return this.flags.has(flag);
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
}
