import { ActionMaker, IAction } from "../actions/actions.js";
import { ActionDBEntry, LocationEffectDBEntry } from "./db/location_db_interfaces.js";
import { LocationEffect } from "./location_effects/location_effects.js";

export class Location
{
    id: string;
    actions: Set<IAction>;
    effects: Set<LocationEffect>;

    constructor(id: string, actionsDBEntries: Set<ActionDBEntry>, effectsDBEntries: Set<LocationEffectDBEntry>)
    {
        this.id = id;
        this.actions = new Set<IAction>();
        this.effects = new Set<LocationEffect>();

        for(const actionDBEntry of actionsDBEntries)
        {
            this.actions.add(ActionMaker.makeAction(actionDBEntry));
        }
        
        for(const effectDBEntry of effectsDBEntries)
        {
            this.effects.add(LocationEffect.makeLocationEffect(effectDBEntry));
        }
    }

    onEnter(): void
    {
        for(const effect of this.effects)
        {
            effect.onEnter();
        }
    }

    update(minutesPassed: number): void
    {
        for(const effect of this.effects)
        {
            if(!effect.allowContinue()) return;
            effect.update(minutesPassed);
        }
    }
    
    onExit(): void
    {
        for(const effect of this.effects)
        {
            effect.onExit();
        }
    }
}