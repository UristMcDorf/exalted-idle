import { ISaveLoadAble } from "../global_interfaces.js";
import { S_localisationManager, S_logManager, S_tooltip, saveLoadAbleList } from "../main.js";
import { IStringUpdate } from "../s_tooltip.js";
import { DB_Item } from "./db/item_db.js";
import { Item } from "./items.js";

class InventoryEntry implements IStringUpdate
{
    H_container!: HTMLDivElement;
    H_labelName!: HTMLSpanElement;
    H_labelAmount!: HTMLSpanElement;

    item: Item;
    amount: number;

    desc: string;

    constructor(item: Item, amount: number)
    {
        this.item = item;
        this.amount = amount;

        this.desc = S_localisationManager.getString(`item.${this.item.id}.desc`);

        this.H_container = this.makeContainer();

        this.H_container.addEventListener("mouseover", evt => S_tooltip.setStringSource(this));
        this.H_container.addEventListener("mouseout", evt => S_tooltip.setVisibility(false)); // TODO: review
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

        if(log) S_logManager.log(`Gained ${amount}x ${S_localisationManager.getString(`item.${this.item.id}.name`)}`);

        this.updateDisplay();
    }

    updateDisplay(): void
    {
        this.H_labelAmount.innerHTML = this.amount.toString();
    }

    updateStringSource(): string
    {
        return this.desc;
    }
}

export class InventoryManager implements ISaveLoadAble
{
    H_inventoryPane: HTMLElement;
    items: Map<string, InventoryEntry>;
    
    constructor()
    {
        this.H_inventoryPane = document.getElementById(`inventory_pane`)!;
        this.items = new Map<string, InventoryEntry>();

        saveLoadAbleList.add(this);
    }

    addItem(id: string, amount: number = 1, log: boolean = true): void
    {
        const item: Item | undefined = DB_Item.get(id);
        if(item === undefined)
        {
            console.error(`Item DB entry with id "${id}" not found!`);
            return;
        }

        if(!this.items.has(id))
        {
            const entry: InventoryEntry = new InventoryEntry(item, 0);

            this.items.set(id, entry);
            this.H_inventoryPane.appendChild(entry.H_container);
        }

        this.items.get(id)!.add(amount, log);
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
}