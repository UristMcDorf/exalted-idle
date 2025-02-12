import { baseAttributeValue } from "../global_statics.js";
import { S_localisationManager, S_tooltip } from "../main.js";
// ordered for the sake of easy table population lmao
export var Attribute;
(function (Attribute) {
    Attribute["Physical"] = "physical";
    Attribute["Social"] = "social";
    Attribute["Mental"] = "mental";
})(Attribute || (Attribute = {}));
export class AttributeContainer {
    constructor(attribute, baseValue = baseAttributeValue) {
        this.attribute = attribute;
        this.baseValue = baseValue;
        this.value = baseValue;
        this.adjustersFlat = new Set();
        this.adjustersMulti = new Set();
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
        shortNameSpan.innerHTML = S_localisationManager.getString(`attribute.${this.attribute}.name`);
        this.H_labelName = shortNameSpan;
        let valueSpan = document.createElement("span");
        valueSpan.id = `attribute_label_value.${this.attribute}`;
        valueSpan.className = `float_right`;
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
    registerAttributeAdjuster(adjuster) {
        if (`flat` in adjuster)
            this.adjustersFlat.add(adjuster);
        if (`multi` in adjuster)
            this.adjustersMulti.add(adjuster);
    }
    // unregistering applied when I need it, which is probably only after I introduce temp effects or somesuch
    recalculate() {
        this.value = this.baseValue;
        for (const adjuster of this.adjustersFlat) {
            this.value += adjuster.flat;
        }
        for (const adjuster of this.adjustersMulti) {
            this.value *= adjuster.multi;
        }
        this.updateDisplay();
    }
    updateDisplay() {
        this.H_labelValue.innerHTML = this.value.toString();
    }
}
