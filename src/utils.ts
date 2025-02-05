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

    static weightedPick(weightedSet: Set<Weighted>): Weighted | null
    {
        if(weightedSet.size == 0) return null;

        let totalWeight: number = 0;

        for(const weighted of weightedSet)
        {
            totalWeight += weighted.weight;
        }

        let randomWeight: number = Math.floor(Math.random() * (totalWeight - 1));

        for(const weighted of weightedSet)
        {
            randomWeight -= weighted.weight;

            if(randomWeight < 0)
            {
                return weighted;
            }
        }

        return null;
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