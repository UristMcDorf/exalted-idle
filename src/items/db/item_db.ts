import { EquipmentSlotType, ItemType } from "../items.js";

export interface ItemDBEntry
{
    type: ItemType;
    id: string;

    // ItemType.Equipment
    slot?: EquipmentSlotType;
}

//TODO: yeah this is crap
export const DB_Item: Map<string, ItemDBEntry> = new Map<string, ItemDBEntry>([
    ["default", { type: ItemType.None, id: "default"}],
    ["stick", { type: ItemType.None, id: "stick" }],
    ["debug_ring", { type: ItemType.Equipment, id: "debug_ring", slot: EquipmentSlotType.Accessory }]
])