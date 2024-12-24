import { IUpdates } from "./global_interfaces.js";
import { ProgressBar } from "./progress_bar.js";
import { Utils } from "./utils.js";

export enum ResourceType
{
    Health = "health",
    Vigour = "vigour",
    Essence = "essence"
}

export interface ResourceRegenModifier
{
    modifier: number;
}

class Resource
{
    value: number;
    minValue: number;
    maxValue: number;

    baseRegen: number;
    regenModifiers: Set<ResourceRegenModifier>;
    
    progressBar: ProgressBar;

    constructor(value: number, minValue: number, maxValue: number, baseRegen: number, progressBar: ProgressBar)
    {
        this.value = value;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.baseRegen = baseRegen;
        this.regenModifiers = new Set<ResourceRegenModifier>();
        this.progressBar = progressBar;
    }

    // returns false if it couldn't adjust
    adjust(amount: number, clampToBounds: boolean = true): boolean
    {
        const adjustedValue: number = this.value + amount;
        const outOfBounds: boolean = adjustedValue < this.minValue || adjustedValue > this.maxValue;

        if(outOfBounds && !clampToBounds) return false;

        this.value = Utils.clamp(adjustedValue, this.minValue, this.maxValue);

        this.progressBar.setValue(this.value);

        return true;
    }

    canAdjust(amount: number): boolean
    {
        const adjustedValue: number = this.value + amount;
        return adjustedValue >= this.minValue && adjustedValue <= this.maxValue;
    }

    regen(): void
    {
        let totalRegen: number = this.baseRegen;

        // should I really iterate over them every tick?
        // I don't think it's too expensive, but maybe a robust system of adjustments when necessary is better
        for(const regenModifier of this.regenModifiers)
        {
            totalRegen *= regenModifier.modifier;
        }

        this.adjust(totalRegen);
    }

    registerModifier(regenModifier: ResourceRegenModifier): void
    {
        this.regenModifiers.add(regenModifier);
    }

    unregisterModifier(regenModifier: ResourceRegenModifier): void
    {
        this.regenModifiers.delete(regenModifier);
    }
}

export class CharacterStateManager implements IUpdates
{
    resources: Map<ResourceType, Resource>;

    constructor()
    {
        this.resources = new Map([
            [ResourceType.Health, new Resource(100, 0, 100, 0.1, new ProgressBar(ResourceType.Health, 100, 100))],
            [ResourceType.Vigour, new Resource(100, 0, 100, 1, new ProgressBar(ResourceType.Vigour, 100, 100))]
        ])
    }

    update(): void
    {
        for(const [key, value] of this.resources)
        {
            value.regen();
        }
    }

    adjustResource(type: ResourceType, amount: number, clampToBounds: boolean = true): void
    {
        this.resources.get(type)!.adjust(amount, clampToBounds);
    }

    canAdjustResource(type: ResourceType, amount: number): boolean
    {
        return this.resources.get(type)!.canAdjust(amount);
    }
}