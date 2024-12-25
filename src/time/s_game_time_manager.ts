// This includes the calendar

import { EDate } from "./exalted_date.js";
import { ISaveLoadAble } from "../global_interfaces.js";
import { tickrate } from "../global_statics.js";

export interface TimeMultiplier
{
    timeMultiplier: number;
}

export class GameTimeManager implements ISaveLoadAble
{
    date: EDate = new EDate(0, 10, 0, 0, 5, 760); // remember that all starts at 0; so new EDate(0, 10, 0, 0, 5, 760) is 10:00 1st Resplendent Water RY 760
    H_timeDisplay: HTMLElement = document.getElementById("display.time")!;
    
    lastUpdateTime: number = Date.now();
    deltaTime: number = 0;

    timeMultipliers: Set<TimeMultiplier> = new Set<TimeMultiplier>();

    //TODO: move initialisation to constructor for consistency

    update(): number
    {
        let minutesPassed: number = 0;

        const newTime: number = Date.now();

        this.deltaTime += (newTime - this.lastUpdateTime) * this.getTimeMultiplier();

        this.lastUpdateTime = newTime;

        while(this.deltaTime >= tickrate)
        {
            this.date.increment(1);

            this.deltaTime -= tickrate;

            minutesPassed++;
        }

        this.H_timeDisplay.innerHTML = this.date.toString();

        return minutesPassed;
    }

    getTimeMultiplier(): number
    {
        let returnMultiplier: number = 1;

        for(const multiplier of this.timeMultipliers)
        {
            returnMultiplier *= multiplier.timeMultiplier;
        }

        return returnMultiplier;
    }

    registerTimeMultiplier(multiplier: TimeMultiplier): void
    {
        this.timeMultipliers.add(multiplier);
    }

    unregisterTimeMultiplier(multiplier: TimeMultiplier): void
    {
        this.timeMultipliers.delete(multiplier);
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