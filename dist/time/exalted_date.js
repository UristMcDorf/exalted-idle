// for "Exalted date"; not Date to avoid conflicts with tsc
export class EDate {
    constructor(minute, hour, day, week, month, year) {
        this.minute = minute;
        this.hour = hour;
        this.day = day;
        this.week = week;
        this.month = month;
        this.year = year;
    }
    increment(minutes) {
        this.minute += minutes;
        // convert minutes to hours
        if (this.minute >= 60) {
            this.hour += Math.floor(this.minute / 60);
            this.minute %= 60;
        }
        else {
            return;
        }
        // convert hours to days
        if (this.hour >= 24) {
            this.day += Math.floor(this.hour / 24);
            this.hour %= 24;
        }
        else {
            return;
        }
        // and now for special stuff which requires step by step (rarely needs more than one loop)
        // Calibration ends at 5 so we start checking then
        while (this.day >= 5) {
            if (this.month == 14) // Calibration hits different
             {
                // we already know it's 5+ days so Calibration and the year is over
                this.day -= 5;
                this.month = 0;
                this.year += 1;
            }
            else {
                if (this.day < 7) // not full week yet
                 {
                    return;
                }
                this.day -= 7;
                this.week += 1;
                if (this.week >= 4) {
                    this.week -= 4;
                    this.month += 1;
                }
            }
        }
    }
    static dayOfMonth(day, week) {
        return day + week * 7 + 1; // doesn't need special case for Calibration because week is always 0
    }
    // defaults to non-calibration
    static dayOfMonthAsString(day, week, month) {
        if (month == 14) {
            return this.calibrationDayNames[day];
        }
        return this.dayOfWeekNames[day] + ", " + this.dayOfMonth(day, week) + " " + this.monthNames[month];
    }
    // TODO: maybe template string for loc purposes?
    toString() {
        return this.hour.toString().padStart(2, "0") +
            ":" +
            this.minute.toString().padStart(2, "0") +
            ", " +
            EDate.dayOfMonthAsString(this.day, this.week, this.month) +
            ", RY " +
            this.year;
    }
    packToJSON() {
        return `[${this.minute}, ${this.hour}, ${this.day}, ${this.week}, ${this.month}, ${this.year}]`;
    }
    static parseFromJSON(data) {
        let parsedData = JSON.parse(`[${data}]`); // we do a little trickery here
        // validation
        if (!Array.isArray(parsedData) || !this.validateArray(parsedData)) {
            console.error(`Failed to parse JSON [${data}] as Exalted Date.`);
            return new EDate(0, 10, 0, 0, 5, 760);
        }
        return new EDate(parsedData[0], parsedData[1], parsedData[2], parsedData[3], parsedData[4], parsedData[5]);
    }
    static validateArray(data) {
        if (data.length != 6)
            return false;
        if (!Number.isInteger(data[0]) || data[0] < 0 || data[0] > 59)
            return false; // minutes
        if (!Number.isInteger(data[1]) || data[1] < 0 || data[1] > 23)
            return false; // hours
        if (!Number.isInteger(data[2]) || data[2] < 0 || data[2] > 6)
            return false; // days
        if (!Number.isInteger(data[3]) || data[3] < 0 || data[3] > 3)
            return false; // weeks
        if (!Number.isInteger(data[4]) || data[4] < 0 || data[4] > 14)
            return false; // months
        if (!Number.isInteger(data[5]))
            return false; // years
        return true;
    }
}
// TODO: localise
// this one is actually staying an array because, well, we're accessing them by specific indices
EDate.dayOfWeekNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];
EDate.calibrationDayNames = [
    "1st day of Calibration",
    "2nd day of Calibration",
    "3rd day of Calibration",
    "4th day of Calibration",
    "5th day of Calibration"
];
EDate.monthNames = [
    "Ascending Air",
    "Resplendent Air",
    "Descending Air",
    "Ascending Water",
    "Resplendent Water",
    "Descending Water",
    "Ascending Wood",
    "Resplendent Wood",
    "Descending Wood",
    "Ascending Fire",
    "Resplendent Fire",
    "Descending Fire",
    "Ascending Earth",
    "Resplendent Earth",
    "Descending Earth",
    "Calibration"
];
