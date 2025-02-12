import { S_localisationManager } from "./main.js";

export interface Weighted
{
    weight: number;
}

export interface WeightedID extends Weighted
{
    id: string;
}

export class Utils
{
    // TODO: upper >= lower checking?
    static clamp(value: number, lower: number, upper: number): number
    {
        return Math.min(upper, Math.max(lower, value));
    }

    static weightedPick<Type extends Weighted>(weightedList: Type[]): Type | null
    {
        if(weightedList.length == 0) return null;

        let totalWeight: number = 0;

        for(const weighted of weightedList)
        {
            totalWeight += weighted.weight;
        }

        let randomWeight: number = Math.floor(Math.random() * totalWeight);

        for(const weighted of weightedList)
        {
            randomWeight -= weighted.weight;

            if(randomWeight < 0)
            {
                return weighted;
            }
        }

        return null;
    }

    static weightedIdListToString<Type extends WeightedID>(baseLocCategory: string, weighteIdList: Type[]): string
    {
        if(weighteIdList.length == 0) return "---";

        let returnString: string = "";
        let totalWeight: number = 0;

        for(const weighted of weighteIdList)
        {
            totalWeight += weighted.weight;
        }

        for(const weighted of weighteIdList)
        {
            returnString += `${((weighted.weight / totalWeight) * 100).toFixed(2)}% - ${S_localisationManager.getString(`${baseLocCategory}.${weighted.id}.name`)}<br>`;
        }

        return returnString.slice(0, -4);
    }

    static moneyToHTML(value: number, thematic: boolean, full: boolean = false): string
    {
       if(thematic)
        {
            let valueString: string = ``;

            if(full || Math.floor(value / 1024) > 0) valueString += `${Math.floor(value / 1024)} Koku `;
            value %= 1024;

            if(full || Math.floor(value / 128) > 0) valueString += `${Math.floor(value / 128)} Qian `;
            value %= 128;

            if(full || Math.floor(value / 64) > 0) valueString += `${Math.floor(value / 64)} Siu `;
            value %= 64;

            if(full || Math.floor(value / 8) > 0) valueString += `${Math.floor(value / 8)} `;
            value %= 8;

            valueString += ` Yen <span class="eighth">(${value}/8)</span>`;

            return valueString;
        }
        else
        {
            return `${value} money`;
        }
    }
}

//TODO: write implicit conversion from tuple
export class MinMax
{
    min: number;
    max: number;

    precision: number;

    value: number;

    constructor(min: number, max: number, precision: number = 0)
    {
        this.min = min;
        this.max = max;
        this.precision = precision;

        const range: number = max - min;

        this.value = Math.round((min + range * Math.random()) * Math.pow(10, precision)) / Math.pow(10, precision);
    }
    
    toString(): string
    {
        return this.value.toFixed();
    }
}