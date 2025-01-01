import { moveToLocation, S_locationDB, S_localisationManager, S_logManager } from "../main.js";
import { LogCategory } from "../s_log_manager.js";
export class ActionMove {
    constructor(from, where) {
        this.isAccessible = true; // getter obviously tbd
        this.description = S_localisationManager.getString("move_" + from + "-" + where);
        this.where = where;
    }
    // I'm sure there are better ways to calling the event but I haven't found them yet
    onClick(action) {
        let thisAction = action;
        if (this.isAccessible) {
            moveToLocation(S_locationDB.retrieveLocation(thisAction.where));
            this.log();
        }
    }
    log() {
        // TODO move to localisable string
        S_logManager.log("Moving to location \"" + S_localisationManager.getString("location_" + this.where) + "\"", LogCategory.Activity);
    }
}
