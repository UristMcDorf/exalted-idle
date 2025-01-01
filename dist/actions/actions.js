import { S_locationManager, S_localisationManager, S_logManager } from "../main.js";
import { LogCategory } from "../s_log_manager.js";
export var ActionType;
(function (ActionType) {
    ActionType[ActionType["Move"] = 0] = "Move";
})(ActionType || (ActionType = {}));
export class ActionMaker {
    static makeAction(dbEntry) {
        let action;
        switch (dbEntry.type) {
            case ActionType.Move:
                action = new ActionMove(dbEntry.moveFrom, dbEntry.moveWhere);
        }
        return action;
    }
}
export class ActionMove {
    constructor(from, where) {
        this.isAccessible = true; // getter obviously tbd
        this.description = S_localisationManager.getString(`action.move.${from}-${where}.text`);
        this.where = where;
    }
    // TODO: I'm sure there are better ways to calling the event but I haven't found them yet
    onClick(action) {
        let thisAction = action;
        if (this.isAccessible) {
            S_locationManager.moveToLocation(thisAction.where);
            this.log();
        }
    }
    log() {
        // TODO move to localisable string
        S_logManager.log("Moving to location \"" + S_localisationManager.getString(`loc.${this.where}.name`) + "\"", LogCategory.Activity);
    }
}
