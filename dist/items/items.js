import { S_inventoryManager, S_localisationManager } from "../main.js";
export var EquipmentSlotType;
(function (EquipmentSlotType) {
    EquipmentSlotType["Head"] = "head";
    EquipmentSlotType["Body"] = "body";
    EquipmentSlotType["MainHand"] = "mainhand";
    EquipmentSlotType["OffHand"] = "offhand";
    EquipmentSlotType["TwoHand"] = "twohand";
    EquipmentSlotType["Accessory"] = "acc";
})(EquipmentSlotType || (EquipmentSlotType = {}));
export var ItemType;
(function (ItemType) {
    ItemType[ItemType["None"] = 0] = "None";
    ItemType[ItemType["Consumable"] = 1] = "Consumable";
    ItemType[ItemType["Usable"] = 2] = "Usable";
    ItemType[ItemType["Equipment"] = 3] = "Equipment";
})(ItemType || (ItemType = {}));
export class Item {
    constructor(id = "default") {
        this.type = ItemType.None;
        this.id = id;
        this.desc = S_localisationManager.getString(`item.${this.id}.desc`);
    }
    static makeItem(dbEntry) {
        let item;
        switch (dbEntry.type) {
            case ItemType.Equipment:
                item = new ItemEquipment(dbEntry.id, dbEntry.slot);
                break;
            case ItemType.None:
            default:
                item = new Item(dbEntry.id);
                break;
        }
        return item;
    }
    // exists to be overriden
    onClicked() { }
    updateTooltipSource() {
        return this.desc;
    }
}
export class ItemEquipment extends Item {
    constructor(id = "default", slot) {
        super(id);
        this.type = ItemType.Equipment;
        this.slot = slot;
    }
    onClicked() {
        S_inventoryManager.tryEquip(this);
    }
}
