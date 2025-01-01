import { Location } from "./location.js";
import { ActionMove } from "../actions/actions.js";
import { LocationSkillGain } from "./location_skill_gain.js";
export class LocationDB {
    constructor() {
        this.locations = new Map();
        this.locations.set("error", new Location("You shouldn't be here.", []));
        /* We'll do YAML a bit later okay */
        this.locations.set("home", new Location("home", [new ActionMove("home", "sleep"), new ActionMove("home", "field")]));
        this.locations.set("sleep", new LocationSkillGain("sleep", [new ActionMove("sleep", "home")], "sleeping", 1));
        this.locations.set("field", new Location("field", [new ActionMove("field", "farm"), new ActionMove("field", "home")]));
        this.locations.set("farm", new LocationSkillGain("farm", [new ActionMove("farm", "field")], "farming", 1));
    }
    retrieveLocation(id) {
        if (!this.locations.has(id)) {
            console.log("Location id \"" + id + "\" not found.");
            return this.locations.get("error");
        }
        return this.locations.get(id);
    }
}
