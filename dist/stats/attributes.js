import { S_localisationManager, S_tooltip } from "../main.js";
// ordered for the sake of easy table population lmao
export var Attribute;
(function (Attribute) {
    Attribute["Strength"] = "strength";
    Attribute["Presence"] = "presence";
    Attribute["Perception"] = "perception";
    Attribute["Dexterity"] = "dexterity";
    Attribute["Manipulation"] = "manipulation";
    Attribute["Intelligence"] = "intelligence";
    Attribute["Stamina"] = "stamina";
    Attribute["Appearance"] = "appearance";
    Attribute["Wits"] = "wits";
})(Attribute || (Attribute = {}));
export class AttributeContainer {
    constructor(attribute, value = 10) {
        this.attribute = attribute;
        this.value = value;
        this.H_container = this.makeContainer();
        this.tooltip = this.setTooltip();
        this.H_container.addEventListener("mouseover", evt => S_tooltip.setTooltipSource(this));
        this.H_container.addEventListener("mouseout", evt => S_tooltip.setVisibility(false)); // TODO: review
    }
    makeContainer() {
        //<span id="attribute_label_name.strength">Str:</span> 
        let container = document.createElement("div");
        container.id = `attribute_label.${this.attribute}`;
        let shortNameSpan = document.createElement("span");
        shortNameSpan.id = `attribute_label_name.${this.attribute}`;
        shortNameSpan.innerHTML = S_localisationManager.getString(`attribute.${this.attribute}.short_name`);
        this.H_labelName = shortNameSpan;
        let valueSpan = document.createElement("span");
        valueSpan.id = `attribute_label_value.${this.attribute}`;
        valueSpan.className = `attribute_grid_item_value`;
        valueSpan.innerHTML = this.value.toString();
        this.H_labelValue = valueSpan;
        container.append(shortNameSpan, ": ", valueSpan);
        return container;
    }
    updateTooltipSource() {
        return this.tooltip;
    }
    setTooltip() {
        return S_localisationManager.getString(`attribute.${this.attribute}.tooltip`);
    }
}
