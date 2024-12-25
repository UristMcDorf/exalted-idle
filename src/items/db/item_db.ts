export interface ItemDBEntry
{
    id: string;
}

//TODO: yeah this is crap
export const DB_Item: Map<string, ItemDBEntry> = new Map<string, ItemDBEntry>([
    ["default", { id: "default"}],
    ["stick", { id: "stick" }]
])