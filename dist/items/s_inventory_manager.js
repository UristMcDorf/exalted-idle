import { S_inventoryManager, S_localisationManager, S_logManager, S_tooltip, saveLoadAbleList } from "../main.js";
import { LogCategory } from "../s_log_manager.js";
import { DB_Item } from "./db/item_db.js";
import { EquipmentSlotType, Item, ItemType } from "./items.js";
class InventoryEntry {
    constructor(item, amount) {
        this.item = item;
        this.amount = amount;
        this.H_container = this.makeContainer();
        this.H_container.addEventListener("mouseover", evt => S_tooltip.setTooltipSource(this));
        this.H_container.addEventListener("mouseout", evt => S_tooltip.setVisibility(false)); // TODO: review
        switch (this.item.type) {
            case ItemType.Consumable:
            case ItemType.Usable:
            case ItemType.Equipment:
                this.H_container.addEventListener("click", evt => this.item.onClicked());
        }
    }
    makeContainer() {
        const container = document.createElement("div");
        container.id = `inventory_entry.${this.item.id}`;
        const nameSpan = document.createElement("span");
        nameSpan.id = `inventory_entry.name.${this.item.id}`;
        nameSpan.innerHTML = S_localisationManager.getString(`item.${this.item.id}.name`);
        this.H_labelName = nameSpan;
        const amountSpan = document.createElement("span");
        amountSpan.id = `inventory_entry.amount.${this.item.id}`;
        amountSpan.className = `inventory_entry_amount`;
        amountSpan.innerHTML = this.amount.toString();
        this.H_labelAmount = amountSpan;
        container.append(nameSpan, " ", amountSpan);
        return container;
    }
    add(amount, log = true) {
        this.amount += amount;
        if (log)
            S_logManager.log(`Gained ${amount}x ${S_localisationManager.getString(`item.${this.item.id}.name`)}`, LogCategory.Loot);
        this.updateDisplay();
    }
    remove(amount) {
        this.amount -= amount;
        this.updateDisplay();
    }
    updateDisplay() {
        this.H_labelAmount.innerHTML = this.amount.toString();
    }
    updateTooltipSource() {
        return this.item.updateTooltipSource();
    }
}
class EquipmentSlot {
    constructor(key, type) {
        this.key = key;
        this.currentlyEquipped = null;
        this.H_container = document.getElementById(`equip_grid.${key}`);
        this.type = type;
        this.H_container.addEventListener("mouseover", evt => this.trySetTooltip());
        this.H_container.addEventListener("mouseout", evt => S_tooltip.setVisibility(false)); // TODO: review
        this.H_container.addEventListener("click", evt => this.tryUnequip());
    }
    tryEquip(item, fromInventory = true) {
        if (this.currentlyEquipped) {
            return false;
        }
        this.currentlyEquipped = item;
        if (fromInventory)
            S_inventoryManager.removeItem(item.id, 1); // for automatically equipped cursed items and stuff
        this.updateDisplay();
        return true;
    }
    // will return false if it can't unequip for whatever reason
    // N/A right now but might very well be later
    tryUnequip() {
        if (this.currentlyEquipped) {
            S_inventoryManager.addItem(this.currentlyEquipped.id, 1, false);
            this.currentlyEquipped = null;
            S_tooltip.setVisibility(false); // TODO: probably a bit hacky in case unequipping happens in some non-manual way, review
            this.updateDisplay();
        }
        return true;
    }
    updateDisplay() {
        if (this.currentlyEquipped) {
            this.H_container.className = `equip_grid_${this.key}`;
            this.H_container.innerHTML = `${S_localisationManager.getString(`item.${this.currentlyEquipped.id}.name`)}`;
        }
        else {
            this.H_container.className = `equip_grid_${this.key} inactive`;
            this.H_container.innerHTML = `${S_localisationManager.getString(`equip_slots.${this.type}`)}`;
        }
    }
    updateTooltipSource() {
        return this.currentlyEquipped ? this.currentlyEquipped.updateTooltipSource() : `This shouldn't happen. Equipment slot emptied while hovering over it.`;
    }
    trySetTooltip() {
        if (this.currentlyEquipped)
            S_tooltip.setTooltipSource(this);
    }
}
export class InventoryManager {
    constructor() {
        this.maxAccessories = 2;
        // ISaveLoadAble implementation
        this.saveId = "inventory";
        this.H_inventoryPane = document.getElementById(`inventory_pane`);
        this.items = new Map();
        this.equips = new Map([
            [`head`, new EquipmentSlot(`head`, EquipmentSlotType.Head)],
            [`body`, new EquipmentSlot(`body`, EquipmentSlotType.Body)],
            [`mainhand`, new EquipmentSlot(`mainhand`, EquipmentSlotType.MainHand)],
            [`offhand`, new EquipmentSlot(`offhand`, EquipmentSlotType.OffHand)]
        ]);
        for (let i = 0; i < this.maxAccessories; i++) {
            this.equips.set(`acc${i}`, new EquipmentSlot(`acc${i}`, EquipmentSlotType.Accessory));
        }
        saveLoadAbleList.add(this);
    }
    addItem(id, amount = 1, log = true) {
        const dbEntry = DB_Item.get(id);
        if (dbEntry === undefined) {
            console.error(`Item DB entry with id "${id}" not found!`);
            return;
        }
        if (!this.items.has(id)) {
            const entry = new InventoryEntry(Item.makeItem(dbEntry), 0);
            this.items.set(id, entry);
            this.H_inventoryPane.appendChild(entry.H_container);
        }
        this.items.get(id).add(amount, log);
    }
    removeItem(id, amount = 1) {
        if (!this.items.has(id)) {
            console.error(`No item with id "${id}" to remove!`);
            return;
        }
        const entry = this.items.get(id);
        if (entry.amount < amount) {
            console.error(`Item with id "${id}" amount: ${entry.amount}, trying to remove ${amount}`);
            return;
        }
        entry.remove(amount);
        // Probably better than just hiding it
        // TODO: evaluate
        if (entry.amount == 0) {
            entry.H_container.remove();
            this.items.delete(id);
        }
    }
    clear() {
        for (const [key, value] of this.items) {
            this.removeItem(key, value.amount);
        }
    }
    unequipAll() {
        for (const [key, value] of this.equips) {
            value.tryUnequip();
        }
    }
    save() {
        let data = "";
        // saving items
        for (const [key, value] of this.items) {
            data += `"${key}":${value.amount},`;
        }
        data = data.slice(0, -1);
        // saving equipment
        let addedEquipmentKey = false;
        for (const [key, value] of this.equips) {
            if (value.currentlyEquipped) {
                if (!addedEquipmentKey) {
                    data += `,"equipment":{`;
                    addedEquipmentKey = true;
                }
                data += `"${key}":"${value.currentlyEquipped.id}",`;
            }
        }
        if (addedEquipmentKey)
            data = `${data.slice(0, -1)}}`;
        return `{${data}}`;
    }
    // rather inefficient, but it's not like it's going to be called often
    // TODO: refactor
    load(data) {
        let returnValue = true;
        let map = new Map(Object.entries(data));
        this.unequipAll();
        this.clear();
        for (const [key, value] of map) {
            if (key == "equipment") {
                for (const [keyEq, valueEq] of Object.entries(value)) {
                    // TODO: rethink algorithm to not necessiate adding from inventory (not doing this rn to avoid creating orphan items)
                    // this is UGLY
                    this.addItem(valueEq.toString(), 1, false);
                    this.tryEquip(this.items.get(valueEq.toString()).item);
                }
            }
            else {
                this.addItem(key, value, false);
            }
        }
        return returnValue;
    }
    tryEquip(equipment, fromInventory = true) {
        // accessories and twohanders are two special cases
        switch (equipment.slot) {
            case EquipmentSlotType.Head:
            case EquipmentSlotType.Body:
            case EquipmentSlotType.MainHand:
            case EquipmentSlotType.OffHand:
                this.equips.get(equipment.slot.toString()).tryEquip(equipment, fromInventory);
                break;
            case EquipmentSlotType.Accessory:
                for (let i = 0; i < this.maxAccessories; i++) {
                    if (this.equips.get(`acc${i}`).tryEquip(equipment, fromInventory))
                        break;
                }
                break;
            case EquipmentSlotType.TwoHand:
                break; // not implemented yet
        }
        return;
    }
    tryUnequip(key) {
        return this.equips.get(key).tryUnequip();
    }
}
