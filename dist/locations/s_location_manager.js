import { Location } from "./location.js";
import { S_localisationManager, saveLoadAbleList, updatesList } from "../main.js";
import { DB_Location } from "./db/location_db.js";
export class LocationManager {
    constructor() {
        this.locationList = new Map();
        // ISaveLoadAble implementation block
        this.saveId = "location_manager";
        this.H_locationContentPanel = document.getElementById("location_content_panel");
        this.H_locationDescriptionPanel = document.getElementById("location_description_panel");
        this.H_locationEffectDisplaysContainer = document.getElementById("location_effect_displays");
        this.H_actionsContainer = document.getElementById("actions_container");
        // TODO: Uuuuuuughhh move to YAML
        for (const dbEntry of DB_Location) {
            this.locationList.set(dbEntry.id, new Location(dbEntry.id, dbEntry.actionList, dbEntry.locationEffectList));
        }
        this.moveToLocation("home");
        saveLoadAbleList.add(this);
        updatesList.add(this);
    }
    retrieveLocation(id) {
        if (!this.locationList.has(id)) {
            console.error(`Location id "${id}" not found.`);
            return this.locationList.get("error");
        }
        return this.locationList.get(id);
    }
    moveToLocation(id) {
        var _a;
        (_a = this.currentLocation) === null || _a === void 0 ? void 0 : _a.onExit();
        this.currentLocation = this.locationList.get(id);
        this.H_locationDescriptionPanel.innerHTML = S_localisationManager.getString(`loc.${this.currentLocation.id}.desc`);
        this.populateActionList(this.currentLocation);
        this.populateLocationEffectsDisplays(this.currentLocation);
        this.currentLocation.onEnter();
    }
    populateActionList(location) {
        this.H_actionsContainer.innerHTML = "";
        for (const action of location.actions) {
            let newActionButton = document.createElement("a");
            newActionButton.innerHTML = action.description;
            newActionButton.className = "action_button bottom_border";
            newActionButton.addEventListener("click", evt => action.onClick(action)); // TODO: see if I can make it without passing it as an argument, icky
            this.H_actionsContainer.appendChild(newActionButton);
        }
    }
    populateLocationEffectsDisplays(location) {
        this.H_locationEffectDisplaysContainer.innerHTML = "";
        for (const effect of location.effects) {
            if (effect.visible) {
                this.H_locationEffectDisplaysContainer.appendChild(effect.H_locationEffectDisplay);
            }
        }
    }
    // IUpdates implementation block
    update(minutesPassed) {
        this.currentLocation.update(minutesPassed);
    }
    save() {
        return `"${this.currentLocation.id}"`;
    }
    load(data) {
        const dataAsString = data.toString();
        if (!this.locationList.has(dataAsString)) {
            console.error(`Failed to load location: ${dataAsString}`);
            this.moveToLocation("error");
            return false;
        }
        this.moveToLocation(dataAsString);
        return true;
    }
}
