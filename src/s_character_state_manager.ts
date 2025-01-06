import { ISaveLoadAble, IUpdates } from "./global_interfaces.js";
import { saveLoadAbleList, updatesList } from "./main.js";
import { ProgressBar } from "./progress_bar.js";
import { Utils } from "./utils.js";

export enum ResourceType
{
    Health = "health",
    Vigour = "vigour",
    Essence = "essence"
}

export interface ResourceRegenMultiplier
{
    multiplier: number;
}

class Resource
{
    value: number;
    minValue: number;
    maxValue: number;

    baseRegen: number;
    regenModifiers: Set<ResourceRegenMultiplier>;
    
    progressBar: ProgressBar;

    constructor(value: number, minValue: number, maxValue: number, baseRegen: number, progressBar: ProgressBar)
    {
        this.value = value;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.baseRegen = baseRegen;
        this.regenModifiers = new Set<ResourceRegenMultiplier>();
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

    regen(times: number): void
    {
        let totalRegen: number = this.baseRegen;

        // should I really iterate over them every tick?
        // I don't think it's too expensive, but maybe a robust system of adjustments when necessary is better
        for(const regenModifier of this.regenModifiers)
        {
            totalRegen *= regenModifier.multiplier;
        }

        this.adjust(totalRegen * times);
    }

    registerModifier(regenModifier: ResourceRegenMultiplier): void
    {
        this.regenModifiers.add(regenModifier);
    }

    unregisterModifier(regenModifier: ResourceRegenMultiplier): void
    {
        this.regenModifiers.delete(regenModifier);
    }

    updateDisplay(): void
    {
        this.progressBar.update();
    }
}

export class CharacterStateManager implements ISaveLoadAble, IUpdates
{

    resources: Map<ResourceType, Resource>;

    flags: Set<string>;

    constructor()
    {
        this.resources = new Map([
            [ResourceType.Health, new Resource(100, 0, 100, 0.1, new ProgressBar(ResourceType.Health, 100, 100))],
            [ResourceType.Vigour, new Resource(100, 0, 100, 1, new ProgressBar(ResourceType.Vigour, 100, 100))]
        ])

        saveLoadAbleList.add(this);
        updatesList.add(this);

        this.flags = new Set<string>();
    }

    update(minutesPassed: number): void
    {
        for(const [key, value] of this.resources)
        {
            value.regen(minutesPassed);
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

    registerModifier(resource: ResourceType, regenModifier: ResourceRegenMultiplier): void
    {
        this.resources.get(resource)!.regenModifiers.add(regenModifier);
    }

    unregisterModifier(resource: ResourceType, regenModifier: ResourceRegenMultiplier): void
    {
        this.resources.get(resource)!.regenModifiers.delete(regenModifier);
    }

    // ISaveLoadAble implementation block
    saveId: string = "character_state";

    save(): string
    {
        let data: string = "";

        for(const [key, value] of this.resources.entries())
        {
            data += `"${key}":${value.value},`
        }

        return `{${data.slice(0, -1)}}`;
    }

    load(data: Object): boolean
    {
        let returnValue: boolean = true;

        for(const [key, value] of Object.entries(data))
        {
            let resource: Resource | undefined = this.resources.get(key as ResourceType);

            if(resource === undefined)
            {
                console.error(`Failed to load resource: ${key}`);

                returnValue = false;
                continue;
            }

            resource.value = value;
        }

        this.updateDisplay();

        return returnValue;
    }

    updateDisplay(): void
    {
        for(const [key, value] of this.resources)
        {
            value.updateDisplay();
        }
    }

    // returns false if flag was already there
    registerFlag(flag: string): boolean
    {
        if(this.flags.has(flag)) return false;

        this.flags.add(flag);
        return true;
    }

    hasFlag(flag: string): boolean
    {
        return this.flags.has(flag);
    }
}