import { EquipmentSlotType, ItemType } from "../items.js";
//TODO: yeah this is crap
export const DB_Item = new Map([
    ["default", { type: ItemType.None, id: "default" }],
    ["stick", { type: ItemType.None, id: "stick" }],
    ["debug_ring", { type: ItemType.Equipment, id: "debug_ring", slot: EquipmentSlotType.Accessory }]
]);
