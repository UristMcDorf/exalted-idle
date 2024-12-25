import { LocationEffectDBEntry } from "../db/location_db_interfaces.js";
import { S_characterStateManager, S_gameTimeManager, S_localisationManager, S_statManager } from "../../main.js";
import { ResourceRegenMultiplier, ResourceType } from "../../s_character_state_manager.js";
import { TimeMultiplier } from "../../time/s_game_time_manager.js";

// TODO: figure out how to split it into files in a way that doesn't make it CaNnOt AcCeSs BeFoRe InItIaLiSaTiOn

export enum LocationEffectType
{
    TimeMultiplier = "time_multiplier",

    SkillGain = "skill_gain",

    AdjustResourcesFlat = "adjust_resources_flat",
    AdjustResourcesMulti = "adjust_resources_multi",

    Duel = "duel", // a minigame for the more interesting enemies, often unique
    ExploreCombat = "explore_combat", // the regular type where you just wail upon 1 to N enemies and vice versa in waves
    MassCombat = "mass_combat", // for fighting big groups of enemies, up to armies

    NONE = "none" // dummy type for the base LocationEffect class
}

// base class for some default display population functions
export class LocationEffect
{
    H_locationEffectDisplay: HTMLElement | null;

    type: LocationEffectType = LocationEffectType.NONE;
    visible: boolean;

    constructor(visible: boolean)
    {
        this.visible = visible;
        this.H_locationEffectDisplay = visible ? this.createDisplay() : null;
    }

    createDisplay(): HTMLElement
    {
        const H_display: HTMLElement = document.createElement("div");

        H_display.className = "top_border";

        return H_display;
    }

    static makeLocationEffect(dbEntry: LocationEffectDBEntry): LocationEffect
    {
        let locationEffect: LocationEffect;

        switch(dbEntry.type)
        {
            case LocationEffectType.SkillGain:
                locationEffect = new LocationEffectSkillGain(dbEntry.visible, dbEntry.skillGainId!, dbEntry.skillGainAmount!);
                break;
            case LocationEffectType.AdjustResourcesFlat:
                locationEffect = new LocationEffectAdjustResourcesFlat(dbEntry.visible, dbEntry.adjustResourcesFlatList!);
                break;
            case LocationEffectType.AdjustResourcesMulti:
                locationEffect = new LocationEffectAdjustResourcesMulti(dbEntry.visible, dbEntry.adjustResourcesMultiList!);
                break;
            case LocationEffectType.TimeMultiplier:
                locationEffect = new LocationEffectTimeMultiplier(dbEntry.visible, dbEntry.timeMultiplier!);
                break;
            case LocationEffectType.NONE:
            default:
                console.error(`Trying to create LocationEffect with type "${dbEntry.type}" (none or not implemented yet). Creating dummy LocationEffect.`);
                locationEffect = new LocationEffect(false);
        }

        return locationEffect;
    }

    // default, works for most string-only descriptions in effects
    updateDisplay(): void
    {
        if(!this.visible) return;

        this.H_locationEffectDisplay!.innerHTML = this.descriptionString();
    }

    // these exist to be overriden
    onEnter(): void { this.updateDisplay() }
    update(minutesPassed: number): void { this.updateDisplay() }
    onExit(): void { this.updateDisplay() }

    allowContinue(): boolean { return true; }
    descriptionString(): string { return `Location effect description string not implemented for "${this.type}}".`; }
}

export class LocationEffectAdjustResourcesFlat extends LocationEffect
{
    type: LocationEffectType = LocationEffectType.AdjustResourcesFlat;

    resourcesList: Map<ResourceType, number>;

    constructor(visible: boolean, resources: Map<ResourceType, number>)
    {
        super(visible);

        this.resourcesList = resources;
    }
    
    update(minutesPassed: number): void
    {
        while(minutesPassed > 0)
        {
            if(this.isExhausted()) return; // we're only spending if we can afford it all

            for(const [key, value] of this.resourcesList)
            {
                S_characterStateManager.adjustResource(key, value);
            }

            minutesPassed--;
        }

        super.update(minutesPassed);
    }

    descriptionString(): string
    {
        // TODO: Currently NOT accurate, but since it's not going to be used for now, nbd :D
        if(this.isExhausted()) // TODO: get rid of double call - first in update() then in updateDisplay()
        {
            return `You're exhausted... (no effects)`;
        }

        let displayResourcesSpending: string = "";

        for(const [key, value] of this.resourcesList)
        {
            displayResourcesSpending += `${value > 0 ? `+${value}` : value} ${key}, `; // looks like "-1 vigour, " or "+4 health, "
        }

        return `${displayResourcesSpending.slice(0, -2)} per second.`;
    }

    allowContinue(): boolean
    {
        return !this.isExhausted();
    }

    private isExhausted(): boolean
    {
        for(const [key, value] of this.resourcesList)
        {
            if(!S_characterStateManager.canAdjustResource(key, value)) return true;
        }

        return false;        
    }
}

export class LocationEffectAdjustResourcesMulti extends LocationEffect
{
    type: LocationEffectType = LocationEffectType.AdjustResourcesMulti;

    resourcesList: Map<ResourceType, ResourceRegenMultiplier>;

    constructor(visible: boolean, resources: Map<ResourceType, ResourceRegenMultiplier>)
    {
        super(visible);

        this.resourcesList = resources;
    }

    onEnter(): void
    {
        for(const [key, value] of this.resourcesList)
        {
            S_characterStateManager.registerModifier(key, value);
        }

        super.onEnter();
    }

    onExit(): void
    {
        for(const [key, value] of this.resourcesList)
        {
            S_characterStateManager.unregisterModifier(key, value);
        }

        super.onExit();
    }
    
    descriptionString(): string
    {
        let displayResourcesSpending: string = "";

        for(const [key, value] of this.resourcesList)
        {
            displayResourcesSpending += `x${Math.round(value.multiplier * 100) / 100} ${key} regen, `; // looks like "x0.5 vigour regen, " or "x4 health regen, "
        }

        return `${displayResourcesSpending.slice(0, -2)}`;
    }
}

export class LocationEffectSkillGain extends LocationEffect
{
    type: LocationEffectType = LocationEffectType.SkillGain;

    skillName: string;
    amountPerTick: number;

    constructor(visible: boolean, skillName: string, amountPerTick: number)
    {
        super(visible);
        // this.H_locationEffectDisplay = document.getElementById("location_effect_display.skill_gain")!

        this.skillName = skillName;
        this.amountPerTick = amountPerTick;
    }

    update(minutesPassed: number): void
    {
        S_statManager.gainSkill(this.skillName, this.amountPerTick * minutesPassed);
        
        super.update(minutesPassed);
    }

    descriptionString(): string
    {
        const skillDisplay: string = S_statManager.skillList.get(this.skillName)!.shouldBeVisible() ? S_localisationManager.getString(`skill.${this.skillName}.name`) : "???";

        return `${this.amountPerTick} ${skillDisplay} skill xp per minute.`;
    }
}

export class LocationEffectTimeMultiplier extends LocationEffect implements TimeMultiplier
{
    type: LocationEffectType = LocationEffectType.TimeMultiplier;

    timeMultiplier: number;

    constructor(visible: boolean, timeMultiplier: number)
    {
        super(visible);
        
        this.timeMultiplier = timeMultiplier;
    }

    onEnter(): void
    {
        S_gameTimeManager.registerTimeMultiplier(this);

        super.onEnter();
    }

    onExit(): void
    {
        S_gameTimeManager.unregisterTimeMultiplier(this);

        super.onExit();
    }

    descriptionString(): string
    {
        return `Time flows ${this.timeMultiplier}x ${this.timeMultiplier < 1 ? `slower` : `faster`} here.`;
    }
}