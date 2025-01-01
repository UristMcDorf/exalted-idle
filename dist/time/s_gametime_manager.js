// This includes the calendar
import { EDate } from "./exalted_date.js";
import { tickrate } from "../main.js";
export class GameTimeManager {
    constructor() {
        // differences in delta time below tolerance will be ignored to avoid 2-second jumps
        // THIS IS PROBABLY TEMPORARY until a robust sequential ticks system is introduced
        this.tolerance = tickrate * 1.02;
        this.date = new EDate(0, 10, 0, 0, 5, 760); // remember that all starts at 0; so new EDate(0, 10, 0, 0, 5, 760) is 10:00 1st Resplendent Water RY 760
        this.lastUpdateTime = Date.now();
        this.deltaTime = 0;
    }
    updateTime(tickrateMultiplier = 1) {
        let newTime = Date.now();
        this.deltaTime += (newTime - this.lastUpdateTime) * tickrateMultiplier;
        this.lastUpdateTime = newTime;
        if (this.deltaTime >= tickrate) {
            let secondsPassed = Math.floor(this.deltaTime / tickrate);
            this.date.increment(secondsPassed);
            if (this.deltaTime < this.tolerance)
                this.deltaTime = 0;
            else
                this.deltaTime %= tickrate;
        }
    }
}
