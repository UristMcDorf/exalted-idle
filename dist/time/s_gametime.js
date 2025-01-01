// This includes the calendar
import { EDate } from "./exalted_date.js";
export class GameTimeSingleton {
    constructor() {
        this.date = new EDate(0, 10, 0, 0, 5, 760); // remember that all starts at 0; so new EDate(0, 10, 0, 0, 5, 760) is 10:00 1st Resplendent Water RY 760
        this.lastUpdateTime = Date.now();
        this.deltaTime = 0;
    }
    get tickrate() {
        // milliseconds per tick; normally 1 tick = 1 second, but this might be adjusted
        // starting small for now, though
        return 1000;
    }
    updateTime() {
        let newTime = Date.now();
        this.deltaTime += newTime - this.lastUpdateTime;
        this.lastUpdateTime = newTime;
        console.log("DELTA TIME: " + this.deltaTime);
        if (this.deltaTime >= this.tickrate) {
            let secondsPassed = Math.floor(this.deltaTime / this.tickrate);
            this.deltaTime %= this.tickrate;
            this.date.increment(secondsPassed); // add days equal to minutes passed, simple!
        }
    }
}
