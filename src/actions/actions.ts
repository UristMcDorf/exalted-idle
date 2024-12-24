import { ActionDBEntry } from "../locations/db/location_db_interfaces.js";
import { S_locationManager, S_localisationManager, S_logManager } from "../main.js";
import { LogCategory } from "../s_log_manager.js";

export enum ActionType
{
    Move
}

export interface IAction
{
    isAccessible: boolean;
    description: string;

    onClick(action: IAction): void;
    log(): void;
}

export class ActionMaker
{
    static makeAction(dbEntry: ActionDBEntry): IAction
    {
        let action: IAction;

        switch(dbEntry.type)
        {
            case ActionType.Move:
                action = new ActionMove(dbEntry.moveFrom!, dbEntry.moveWhere!);
        }

        return action;
    }
}

export class ActionMove implements IAction
{
    isAccessible: boolean = true; // getter obviously tbd
    description: string;

    where: string; // location id

    constructor(from: string, where: string)
    {
        this.description = S_localisationManager.getString(`action.move.${from}-${where}.text`);
        this.where = where;
    }

    // TODO: I'm sure there are better ways to calling the event but I haven't found them yet
    public onClick(action: IAction): void
    {
        let thisAction: ActionMove = action as ActionMove;
        
        if(this.isAccessible)
        {
            S_locationManager.moveToLocation(thisAction.where);

            this.log();
        }
    }

    log(): void
    {
        // TODO move to localisable string
        S_logManager.log("Moving to location \"" + S_localisationManager.getString(`loc.${this.where}.name`) + "\"", LogCategory.Activity);
    }
}