import { Location } from "./location.js";
import { ActionMove } from "./actions.js";
export class LocationDB {
    constructor() {
        this.locations = new Map();
        this.locations.set("error", new Location("You shouldn't be here.", []));
        /* We'll do YAML a bit later okay */
        this.locations.set("home", new Location("Cozy home", [new ActionMove("Go sleep", "sleep"), new ActionMove("Go outside", "field")]));
        this.locations.set("sleep", new Location("You are sleeping zzz", [new ActionMove("Get up", "home")]));
        this.locations.set("field", new Location("Field full of crops", [new ActionMove("Farm", "farm"), new ActionMove("Go home", "home")]));
        this.locations.set("farm", new Location("You are farming", [new ActionMove("Stop farming", "field")]));
    }
    RetrieveLocation(id) {
        if (!this.locations.has(id)) {
            console.log("Location id \"" + id + "\" not found.");
            return this.locations.get("error");
        }
        return this.locations.get(id);
    }
}
