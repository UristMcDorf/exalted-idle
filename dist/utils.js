import { S_localisationManager } from "./main.js";
export class Utils {
    // TODO: upper >= lower checking?
    static clamp(value, lower, upper) {
        return Math.min(upper, Math.max(lower, value));
    }
    static weightedPick(weightedList) {
        if (weightedList.length == 0)
            return null;
        let totalWeight = 0;
        for (const weighted of weightedList) {
            totalWeight += weighted.weight;
        }
        let randomWeight = Math.floor(Math.random() * totalWeight);
        for (const weighted of weightedList) {
            randomWeight -= weighted.weight;
            if (randomWeight < 0) {
                return weighted;
            }
        }
        return null;
    }
    static weightedIdListToString(baseLocCategory, weighteIdList) {
        if (weighteIdList.length == 0)
            return "---";
        let returnString = "";
        let totalWeight = 0;
        for (const weighted of weighteIdList) {
            totalWeight += weighted.weight;
        }
        for (const weighted of weighteIdList) {
            returnString += `${((weighted.weight / totalWeight) * 100).toFixed(2)}% - ${S_localisationManager.getString(`${baseLocCategory}.${weighted.id}.name`)}<br>`;
        }
        return returnString.slice(0, -4);
    }
    static moneyToHTML(value, thematic, full = false) {
        if (thematic) {
            let valueString = ``;
            if (full || Math.floor(value / 1024) > 0)
                valueString += `${Math.floor(value / 1024)} Koku `;
            value %= 1024;
            if (full || Math.floor(value / 128) > 0)
                valueString += `${Math.floor(value / 128)} Qian `;
            value %= 128;
            if (full || Math.floor(value / 64) > 0)
                valueString += `${Math.floor(value / 64)} Siu `;
            value %= 64;
            if (full || Math.floor(value / 8) > 0)
                valueString += `${Math.floor(value / 8)} `;
            value %= 8;
            valueString += ` Yen <span class="eighth">(${value}/8)</span>`;
            return valueString;
        }
        else {
            return `${value} money`;
        }
    }
}
//TODO: write implicit conversion from tuple
export class MinMax {
    constructor(min, max, precision = 0) {
        this.min = min;
        this.max = max;
        this.precision = precision;
        const range = max - min;
        this.value = Math.round((min + range * Math.random()) * Math.pow(10, precision)) / Math.pow(10, precision);
    }
    toString() {
        return this.value.toFixed();
    }
}
