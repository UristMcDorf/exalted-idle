import { S_displayManager, S_settingsManager } from "./main.js";
import { Utils } from "./utils.js";

export interface IMoneyDisplaySource
{
    getMoneyAmount(): number;
}

export class MoneyDisplay
{
    container: HTMLElement;

    source: IMoneyDisplaySource | number;

    constructor(container: HTMLElement, source: IMoneyDisplaySource | number)
    {
        this.container = container;

        this.source = source;

        S_displayManager.registerMoneyDisplay(this);
        this.update();
    }

    update(): void
    {
        let value: number = (typeof this.source == "number") ? this.source : this.source.getMoneyAmount();

        this.container.innerHTML = Utils.moneyToHTML(value, S_settingsManager.thematicMoneyDisplay, true);
    }
}