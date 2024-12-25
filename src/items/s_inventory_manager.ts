import { ISaveLoadAble } from "../global_interfaces.js";
import { S_localisationManager } from "../main.js";
import { DB_Item } from "./db/item_db.js";
import { Item } from "./items.js";

class InventoryEntry
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

    add(amount: number): void
    {
        this.amount += amount;

        this.updateDisplay();
    }

    updateDisplay(): void
    {
        this.H_labelAmount.innerHTML = this.amount.toString();
    }
}

export class InventoryManager // implements ISaveLoadAble
{
    H_inventoryPane: HTMLElement;
    items: Map<string, InventoryEntry>;
    
    constructor()
    {
        this.H_inventoryPane = document.getElementById(`inventory_pane`)!;
        this.items = new Map<string, InventoryEntry>();
    }

    addItem(id: string, amount: number = 1): void
    {
        const item: Item | undefined = DB_Item.get(id);
        if(item === undefined)
        {
            console.error(`Item DB entry with id "${id}" not found!`);
            return;
        }

        if(!this.items.has(id))
        {
            const entry: InventoryEntry = new InventoryEntry(item, amount);

            this.items.set(id, entry);
            this.H_inventoryPane.appendChild(entry.H_container);

            return;
        }

        this.items.get(id)!.add(amount);
    }
}