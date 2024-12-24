// This includes the calendar

import { EDate } from "./exalted_date.js";
import { getTickRateMultiplier } from "../main.js"
import { ISaveLoadAble, IUpdates } from "../global_interfaces.js";
import { tickrate } from "../global_statics.js";

export class GameTimeManager implements ISaveLoadAble, IUpdates
{
    date: EDate = new EDate(0, 10, 0, 0, 5, 760); // remember that all starts at 0; so new EDate(0, 10, 0, 0, 5, 760) is 10:00 1st Resplendent Water RY 760
    H_timeDisplay: HTMLElement = document.getElementById("display.time")!;
    
    lastUpdateTime: number = Date.now();
    deltaTime: number = 0;

    public update(): void
    {
        let newTime: number = Date.now();

        this.deltaTime += (newTime - this.lastUpdateTime) * getTickRateMultiplier();

        this.lastUpdateTime = newTime;

        while(this.deltaTime >= tickrate)
        {
            this.date.increment(1);

            this.deltaTime -= tickrate;
        }

        this.H_timeDisplay.innerHTML = this.date.toString();
    }

    // ISaveLoadAble implementation block

    saveId: string = "game_time_manager";
    
    save(): string
    {
        return `${this.date.packToJSON()}`;
    }

    load(data: Object): boolean
    {
        this.date = EDate.parseFromJSON(data.toString());

        this.update();

        return true; // the error is thrown by the parseFromJSON, not this
    }
}