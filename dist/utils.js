export class Utils {
    // TODO: upper >= lower checking?
    static clamp(value, lower, upper) {
        return Math.min(upper, Math.max(lower, value));
    }
}
