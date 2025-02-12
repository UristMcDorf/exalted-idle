import { EventType } from "../event.js";

export interface EventDBEntry
{
    type: EventType;

    //EventType.LogMessage
    message?: string;
}

export const DB_Event: Map<string, EventDBEntry> = new Map<string, EventDBEntry>([
    [ "test", { type: EventType.LogMessage, message: "Test event fired." } ]
])