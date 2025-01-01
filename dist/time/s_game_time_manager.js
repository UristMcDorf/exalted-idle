// This includes the calendar
import { EDate } from "./exalted_date.js";
import { tickrate } from "../global_statics.js";
import { saveLoadAbleList } from "../main.js";
export class GameTimeManager {
    // remember that all starts at 0; so new EDate(0, 10, 0, 0, 5, 760) is 10:00 1st Resplendent Water RY 760
    constructor(date = new EDate(0, 10, 0, 0, 5, 760)) {
        // ISaveLoadAble implementation block
        this.saveId = "game_time_manager";
        this.date = date;
        this.H_timeDisplay = document.getElementById("display.time");
        this.lastUpdateTime = Date.now();
        this.deltaTime = 0;
        this.timeMultipliers = new Set();
        saveLoadAbleList.add(this);
    }
    update() {
        let minutesPassed = 0;
        const newTime = Date.now();
        this.deltaTime += (newTime - this.lastUpdateTime) * this.getTimeMultiplier();
        this.lastUpdateTime = newTime;
        while (this.deltaTime >= tickrate) {
            this.date.increment(1);
            this.deltaTime -= tickrate;
            minutesPassed++;
        }
        this.H_timeDisplay.innerHTML = this.date.toString();
        return minutesPassed;
    }
    getTimeMultiplier() {
        let returnMultiplier = 1;
        for (const multiplier of this.timeMultipliers) {
            returnMultiplier *= multiplier.timeMultiplier;
        }
        return returnMultiplier;
    }
    registerTimeMultiplier(multiplier) {
        this.timeMultipliers.add(multiplier);
    }
    unregisterTimeMultiplier(multiplier) {
        this.timeMultipliers.delete(multiplier);
    }
    save() {
        return `${this.date.packToJSON()}`;
    }
    load(data) {
        this.date = EDate.parseFromJSON(data.toString());
        this.update();
        return true; // the error is thrown by the parseFromJSON, not this
    }
}
