import { EventType } from "../event.js";
export const DB_Event = new Map([
    ["test", { type: EventType.LogMessage, message: "Test event fired." }]
]);
