import { LocationEffectDBEntry } from "../db/location_db_interfaces.js";
import { S_characterStateManager, S_localisationManager, S_statManager } from "../../main.js";
import { ResourceType } from "../../s_character_state_manager.js";

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
                locationEffect = new LocationEffectAdjustResourcesFlat(dbEntry.visible, dbEntry.adjustResourcesList!);
                break;
            case LocationEffectType.AdjustResourcesMulti:
                locationEffect = new LocationEffectAdjustResourcesMulti(dbEntry.visible, dbEntry.adjustResourcesList!);
                break;
            case LocationEffectType.NONE:
            default:
                console.error(`Trying to create LocationEffect with type "${dbEntry.type}" (none or not implemented yet). Creating dummy LocationEffect.`);
                locationEffect = new LocationEffect(false);
        }

        return locationEffect;
    }

    // these exist to be overriden
    onEnter(): void {}
    update(): void {}
    onExit(): void {}

    allowContinue(): boolean { return true; }
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
    
    onEnter(): void
    {
        this.updateDisplay();
    }

    update(): void
    {
        if(this.isExhausted()) return; // we're only spending if we can afford it all

        for(const [key, value] of this.resourcesList)
        {
            S_characterStateManager.adjustResource(key, value);
        }

        this.updateDisplay();
    }

    updateDisplay(): void
    {
        if(!this.visible) return;

        // TODO: Currently NOT correct, but since it's not going to be used for now, nbd :D
        if(this.isExhausted()) // TODO: get rid of double call - first in update() then in updateDisplay()
        {
            this.H_locationEffectDisplay!.innerHTML = `You're exhausted... (no effects)`;
            return;
        }

        let displayResourcesSpending: string = "";

        for(const [key, value] of this.resourcesList)
        {
            displayResourcesSpending += `${value > 0 ? `+${value}` : value} ${key}, `; // looks like "-1 vigour, " or "+4 health, "
        }

        this.H_locationEffectDisplay!.innerHTML = `${displayResourcesSpending.slice(0, -2)} per second.`;
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

    resourcesList: Map<ResourceType, number>;

    constructor(visible: boolean, resources: Map<ResourceType, number>)
    {
        super(visible);

        this.resourcesList = resources;
    }
    
    onEnter(): void
    {
        this.updateDisplay();
    }

    update(): void
    {
        this.updateDisplay();
    }

    updateDisplay(): void
    {
        if(!this.visible) return;

        let displayResourcesSpending: string = "";

        for(const [key, value] of this.resourcesList)
        {
            displayResourcesSpending += `x${Math.round(value * 100) / 100} ${key} regen, `; // looks like "x0.5 vigour regen, " or "x4 health regen, "
        }

        this.H_locationEffectDisplay!.innerHTML = `${displayResourcesSpending.slice(0, -2)}`;
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
        //this.H_locationEffectDisplay = document.getElementById("location_effect_display.skill_gain")!

        this.skillName = skillName;
        this.amountPerTick = amountPerTick;
    }

    onEnter(): void
    {
        this.updateDisplay();
    }

    update(): void
    {
        S_statManager.gainSkill(this.skillName, this.amountPerTick);
        this.updateDisplay();
    }

    updateDisplay(): void
    {
        if(!this.visible) return;

        const skillDisplay: string = S_statManager.skillList.get(this.skillName)!.shouldBeVisible() ? S_localisationManager.getString(`skill.${this.skillName}.name`) : "???";
        this.H_locationEffectDisplay!.innerHTML = `${this.amountPerTick} ${skillDisplay} skill xp per minute.`;
    }
}