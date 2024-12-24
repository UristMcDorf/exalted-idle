export class Utils
{
    // TODO: upper >= lower checking?
    static clamp(value: number, lower: number, upper: number)
    {
        return Math.min(upper, Math.max(lower, value));
    }
}