import { ActionMaker } from "../actions/actions.js";
import { LocationEffect } from "./location_effects/location_effects.js";
export class Location {
    constructor(id, actionsDBEntries, effectsDBEntries) {
        this.id = id;
        this.actions = new Set();
        this.effects = new Set();
        for (const actionDBEntry of actionsDBEntries) {
            this.actions.add(ActionMaker.makeAction(actionDBEntry));
        }
        for (const effectDBEntry of effectsDBEntries) {
            this.effects.add(LocationEffect.makeLocationEffect(effectDBEntry));
        }
    }
    onEnter() {
        for (const effect of this.effects) {
            effect.onEnter();
        }
    }
    update(minutesPassed) {
        for (const effect of this.effects) {
            if (!effect.allowContinue())
                return;
            effect.update(minutesPassed);
        }
    }
    onExit() {
        for (const effect of this.effects) {
            effect.onExit();
        }
    }
}
