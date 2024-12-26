import { ISaveLoadAble } from "../global_interfaces.js";
import { S_inventoryManager, S_localisationManager, S_logManager, S_tooltip, saveLoadAbleList } from "../main.js";
import { LogCategory } from "../s_log_manager.js";
import { ITooltipSource } from "../s_tooltip.js";
import { DB_Item, ItemDBEntry } from "./db/item_db.js";
import { EquipmentSlotType, Item, ItemEquipment, ItemType } from "./items.js";

class InventoryEntry implements ITooltipSource
{
    H_container!: HTMLDivElement;
    H_labelName!: HTMLSpanElement;
    H_labelAmount!: HTMLSpanElement;

    item: Item;
    amount: number;

    constructor(item: Item, amount: number)
    {
        this.item = item;
        this.amount = amount;

        this.H_container = this.makeContainer();

        this.H_container.addEventListener("mouseover", evt => S_tooltip.setTooltipSource(this));
        this.H_container.addEventListener("mouseout", evt => S_tooltip.setVisibility(false)); // TODO: review

        switch(this.item.type)
        {
            case ItemType.Consumable:
            case ItemType.Usable:
            case ItemType.Equipment:
                this.H_container.addEventListener("click", evt => this.item.onClicked());
        }
    }
    
    makeContainer(): HTMLDivElement
    {
        const container: HTMLDivElement = document.createElement("div");
        container.id = `inventory_entry.${this.item.id}`;

        const nameSpan: HTMLSpanElement = document.createElement("span");
        nameSpan.id = `inventory_entry.name.${this.item.id}`;
        nameSpan.innerHTML = S_localisationManager.getString(`item.${this.item.id}.name`);
        this.H_labelName = nameSpan;

        const amountSpan: HTMLSpanElement = document.createElement("span");
        amountSpan.id = `inventory_entry.amount.${this.item.id}`;
        amountSpan.className = `inventory_entry_amount`;
        amountSpan.innerHTML = this.amount.toString();
        this.H_labelAmount = amountSpan;

        container.append(nameSpan, " ", amountSpan);

        return container;
    }

    add(amount: number, log: boolean = true): void
    {
        this.amount += amount;

        if(log) S_logManager.log(`Gained ${amount}x ${S_localisationManager.getString(`item.${this.item.id}.name`)}`, LogCategory.Loot);

        this.updateDisplay();
    }

    remove(amount: number): void
    {
        this.amount -= amount;

        this.updateDisplay();
    }

    updateDisplay(): void
    {
        this.H_labelAmount.innerHTML = this.amount.toString();
    }

    updateTooltipSource(): string
    {
        return this.item.updateTooltipSource();
    }
}

class EquipmentSlot implements ITooltipSource
{
    type: EquipmentSlotType;
    H_container: HTMLElement;
    currentlyEquipped: ItemEquipment | null;

    constructor(key: string, type: EquipmentSlotType)
    {
        this.currentlyEquipped = null;

        this.H_container = document.getElementById(`equip_grid.${key}`)!;
        this.type = type;

        this.H_container.addEventListener("mouseover", evt => this.trySetTooltip());
        this.H_container.addEventListener("mouseout", evt => S_tooltip.setVisibility(false)); // TODO: review

        this.H_container.addEventListener("click", evt => this.tryUnequip());
    }

    tryEquip(item: ItemEquipment, fromInventory: boolean = true): boolean
    {
        if(this.currentlyEquipped)
        {
            return false;
        }

        this.currentlyEquipped = item;
        if(fromInventory) S_inventoryManager.removeItem(item.id, 1); // for automatically equipped cursed items and stuff

        this.updateDisplay();

        return true;
    }

    // will return false if it can't unequip for whatever reason
    // N/A right now but might very well be later
    tryUnequip(): boolean
    {
        if(this.currentlyEquipped)
        {
            S_inventoryManager.addItem(this.currentlyEquipped.id, 1, false);

            this.currentlyEquipped = null;
            S_tooltip.setVisibility(false); // TODO: probably a bit hacky in case unequipping happens in some non-manual way, review

            this.updateDisplay();
        }

        return true;
    }

    updateDisplay(): void
    {
        if(this.currentlyEquipped)
        {
            this.H_container.style.color = `var(--font-color)`;
            this.H_container.innerHTML = `${S_localisationManager.getString(`item.${this.currentlyEquipped.id}.name`)}`;
        }
        else
        {
            this.H_container.style.color = `var(--hint-font-color)`;
            this.H_container.innerHTML = `${S_localisationManager.getString(`equip_slots.${this.type}`)}`;
        }
    }

    updateTooltipSource(): string
    {
        return this.currentlyEquipped ? this.currentlyEquipped.updateTooltipSource() : `This shouldn't happen. Equipment slot emptied while hovering over it.`;
    }

    trySetTooltip(): void
    {
        if(this.currentlyEquipped) S_tooltip.setTooltipSource(this);
    }
}

export class InventoryManager implements ISaveLoadAble
{
    H_inventoryPane: HTMLElement;

    items: Map<string, InventoryEntry>;

    equips: Map<string, EquipmentSlot>;
    maxAccessories: number = 2;
    
    constructor()
    {
        this.H_inventoryPane = document.getElementById(`inventory_pane`)!;
        this.items = new Map<string, InventoryEntry>();

        this.equips = new Map<string, EquipmentSlot>([
            [`head`, new EquipmentSlot(`head`, EquipmentSlotType.Head)],
            [`body`, new EquipmentSlot(`body`, EquipmentSlotType.Body)],
            [`mainhand`, new EquipmentSlot(`mainhand`, EquipmentSlotType.MainHand)],
            [`offhand`, new EquipmentSlot(`offhand`, EquipmentSlotType.OffHand)]
        ]);

        for(let i = 0; i < this.maxAccessories; i++)
        {
            this.equips.set(`acc${i}`, new EquipmentSlot(`acc${i}`, EquipmentSlotType.Accessory));
        }

        saveLoadAbleList.add(this);
    }

    addItem(id: string, amount: number = 1, log: boolean = true): void
    {
        const dbEntry: ItemDBEntry | undefined = DB_Item.get(id);
        if(dbEntry === undefined)
        {
            console.error(`Item DB entry with id "${id}" not found!`);
            return;
        }

        if(!this.items.has(id))
        {
            const entry: InventoryEntry = new InventoryEntry(Item.makeItem(dbEntry), 0);

            this.items.set(id, entry);
            this.H_inventoryPane.appendChild(entry.H_container);
        }

        this.items.get(id)!.add(amount, log);
    }

    removeItem(id: string, amount: number = 1): void
    {
        if(!this.items.has(id))
        {
            console.error(`No item with id "${id}" to remove!`);
            return;
        }

        const entry: InventoryEntry = this.items.get(id)!;

        if(entry.amount < amount)
        {
            console.error(`Item with id "${id}" amount: ${entry.amount}, trying to remove ${amount}`);
            return;
        }

        entry.remove(amount);

        // Probably better than just hiding it
        // TODO: evaluate
        if(entry.amount == 0)
        {
            entry.H_container.remove();
            this.items.delete(id);
        }
    }

    // ISaveLoadAble implementation

    saveId: string = "inventory";

    save(): string
    {
        let data: string = "";

        for(const [key, value] of this.items)
        {
            data += `"${key}":${value.amount},`
        }

        return `{${data.slice(0, -1)}}`;
    }

    load(data: Object): boolean
    {
        let returnValue: boolean = true;
        let map = new Map(Object.entries(data));

        for(const [key, value] of map)
        {
            this.addItem(key, value as number, false);
        }

        return returnValue;
    }


    tryEquip(equipment: ItemEquipment): void
    {
        // accessories and twohanders are two special cases
        switch(equipment.slot)
        {
            case EquipmentSlotType.Head:
            case EquipmentSlotType.Body:
            case EquipmentSlotType.MainHand:
            case EquipmentSlotType.OffHand:
                this.equips.get(equipment.slot.toString())!.tryEquip(equipment);
                break;
            case EquipmentSlotType.Accessory:
                for(let i = 0; i < this.maxAccessories; i++)
                {
                    if(this.equips.get(`acc${i}`)!.tryEquip(equipment)) break;
                }
                break;
            case EquipmentSlotType.TwoHand:
                break; // not implemented yet
        }

        return;
    }

    tryUnequip(key: string): boolean
    {
        return this.equips.get(key)!.tryUnequip();
    }
}