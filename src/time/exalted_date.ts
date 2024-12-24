// for "Exalted date"; not Date to avoid conflicts with tsc
export class EDate
{
    // TODO: localise
    // this one is actually staying an array because, well, we're accessing them by specific indices
    private static dayOfWeekNames: string[] =
    [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    private static calibrationDayNames: string[] =
    [
        "1st day of Calibration",
        "2nd day of Calibration",
        "3rd day of Calibration",
        "4th day of Calibration",
        "5th day of Calibration"
    ];

    private static monthNames: string[] = 
    [
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

    minute: number; // range 0 to 59
    hour: number; // range 0 to 23
    day: number; // range 0 to 6; converts to proper names
    week: number; // range 0 to 3; displays +1
    month: number; // range 0 to 14; converts to proper names
    year: number; // range -inf to inf

    constructor(minute: number, hour: number, day: number, week: number, month: number, year: number)
    {
        this.minute = minute;
        this.hour = hour;
        this.day = day;
        this.week = week;
        this.month = month;
        this.year = year;
    }

    increment(minutes: number): void
    {
        this.minute += minutes;

        // convert minutes to hours
        if(this.minute >= 60)
        {
            this.hour += Math.floor(this.minute / 60);
            this.minute %= 60;
        }
        else
        {
            return;
        }

        // convert hours to days
        if(this.hour >= 24)
        {
            this.day += Math.floor(this.hour / 24);
            this.hour %= 24;
        }
        else
        {
            return;
        }

        // and now for special stuff which requires step by step (rarely needs more than one loop)
        // Calibration ends at 5 so we start checking then
        while(this.day >= 5)
        {
            if(this.month == 14) // Calibration hits different
            {
                // we already know it's 5+ days so Calibration and the year is over

                this.day -= 5;
                this.month = 0;
                this.year += 1;
            }
            else
            {
                if(this.day < 7) // not full week yet
                {
                    return;
                }

                this.day -= 7;
                this.week += 1;

                if(this.week >= 4)
                {
                    this.week -= 4;
                    this.month += 1;
                }
            }
        }
    }

    private static dayOfMonth(day: number, week: number): number
    {
        return day + week * 7 + 1; // doesn't need special case for Calibration because week is always 0
    }

    // defaults to non-calibration
    private static dayOfMonthAsString(day: number, week: number, month: number): string
    {
        if(month == 14)
        {
            return this.calibrationDayNames[day];
        }

        return this.dayOfWeekNames[day] + ", " + this.dayOfMonth(day, week) + " " + this.monthNames[month];
    }

    // TODO: maybe template string for loc purposes?
    toString(): string
    {
        return this.hour.toString().padStart(2, "0") +
            ":" +
            this.minute.toString().padStart(2, "0") +
            ", " +
            EDate.dayOfMonthAsString(this.day, this.week, this.month) +
            ", RY " +
            this.year
        ;
    }

    packToJSON(): string
    {
        return `[${this.minute}, ${this.hour}, ${this.day}, ${this.week}, ${this.month}, ${this.year}]`;
    }

    static parseFromJSON(data: string): EDate
    {
        let parsedData = JSON.parse(`[${data}]`); // we do a little trickery here

        // validation
        if(!Array.isArray(parsedData) || !this.validateArray(parsedData))
        {
            console.error(`Failed to parse JSON [${data}] as Exalted Date.`)

            return new EDate(0, 10, 0, 0, 5, 760);
        }

        return new EDate(parsedData[0], parsedData[1], parsedData[2], parsedData[3], parsedData[4], parsedData[5]);
    }

    static validateArray(data: number[]): boolean
    {
        if(data.length != 6) return false;

        if(!Number.isInteger(data[0]) || data[0] < 0 || data[0] > 59) return false; // minutes
        if(!Number.isInteger(data[1]) || data[1] < 0 || data[1] > 23) return false; // hours
        if(!Number.isInteger(data[2]) || data[2] < 0 || data[2] > 6) return false; // days
        if(!Number.isInteger(data[3]) || data[3] < 0 || data[3] > 3) return false; // weeks
        if(!Number.isInteger(data[4]) || data[4] < 0 || data[4] > 14) return false; // months
        if(!Number.isInteger(data[5])) return false; // years

        return true;
    }
}
