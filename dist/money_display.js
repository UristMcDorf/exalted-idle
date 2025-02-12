import { S_displayManager, S_settingsManager } from "./main.js";
import { Utils } from "./utils.js";
export class MoneyDisplay {
    constructor(container, source) {
        this.container = container;
        this.source = source;
        S_displayManager.registerMoneyDisplay(this);
        this.update();
    }
    update() {
        let value = (typeof this.source == "number") ? this.source : this.source.getMoneyAmount();
        this.container.innerHTML = Utils.moneyToHTML(value, S_settingsManager.thematicMoneyDisplay, true);
    }
}
