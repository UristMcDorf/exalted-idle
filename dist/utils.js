export class Utils {
    // TODO: upper >= lower checking?
    static clamp(value, lower, upper) {
        return Math.min(upper, Math.max(lower, value));
    }
    static weightedPick(weightedSet) {
        if (weightedSet.size == 0)
            return null;
        let totalWeight = 0;
        for (const weighted of weightedSet) {
            totalWeight += weighted.weight;
        }
        let randomWeight = Math.floor(Math.random() * (totalWeight - 1));
        for (const weighted of weightedSet) {
            randomWeight -= weighted.weight;
            if (randomWeight < 0) {
                return weighted;
            }
        }
        return null;
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
