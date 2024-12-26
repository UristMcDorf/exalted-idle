import { S_inventoryManager, S_localisationManager } from "../main.js";
import { ITooltipSource } from "../s_tooltip.js";
import { ItemDBEntry } from "./db/item_db.js";

export enum EquipmentSlotType
{
    Head = "head",
    Body = "body",
    MainHand = "mainhand",
    OffHand = "offhand",
    TwoHand = "twohand",
    Accessory = "acc"
}

export enum ItemType
{
    None, // no special behaviour
    Consumable,
    Usable,
    Equipment
}

export class Item implements ITooltipSource
{
    type: ItemType = ItemType.None;

    id: string;
    desc: string;

    constructor(id: string = "default")
    {
        this.id = id;
        this.desc = S_localisationManager.getString(`item.${this.id}.desc`);
    }

    static makeItem(dbEntry: ItemDBEntry): Item
    {
        let item: Item;

        switch(dbEntry.type)
        {
            case ItemType.Equipment:
                item = new ItemEquipment(dbEntry.id, dbEntry.slot!);
                break;
            case ItemType.None:
            default:
                item = new Item(dbEntry.id);
                break;
        }

        return item;
    }

    // exists to be overriden
    onClicked(): void { }

    updateTooltipSource(): string
    {
        return this.desc;
    }
}

export class ItemEquipment extends Item
{
    type: ItemType = ItemType.Equipment;

    slot: EquipmentSlotType;

    constructor(id: string = "default", slot: EquipmentSlotType)
    {
        super(id);

        this.slot = slot;
    }

    onClicked(): void
    {
        S_inventoryManager.tryEquip(this);
    }
}