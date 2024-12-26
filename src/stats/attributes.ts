import { S_localisationManager, S_tooltip } from "../main.js";
import { ITooltipSource } from "../s_tooltip.js";

// ordered for the sake of easy table population lmao
export enum Attribute
{
    Strength = "strength",
    Presence = "presence",
    Perception = "perception",
    Dexterity = "dexterity",
    Manipulation = "manipulation",
    Intelligence = "intelligence",
    Stamina = "stamina",
    Appearance = "appearance",
    Wits = "wits"
}

export class AttributeContainer implements ITooltipSource
{
    H_container!: HTMLDivElement;
    H_labelName!: HTMLSpanElement;
    H_labelValue!: HTMLSpanElement;

    attribute: Attribute;
    tooltip: string;

    value: number;

    constructor(attribute: Attribute, value: number = 10)
    {
        this.attribute = attribute;
        this.value = value;

        this.H_container = this.makeContainer();

        this.tooltip = this.setTooltip();

        this.H_container.addEventListener("mouseover", evt => S_tooltip.setTooltipSource(this));
        this.H_container.addEventListener("mouseout", evt => S_tooltip.setVisibility(false)); // TODO: review
    }

    makeContainer(): HTMLDivElement
    {
        //<span id="attribute_label_name.strength">Str:</span> 
        let container: HTMLDivElement = document.createElement("div");
        container.id = `attribute_label.${this.attribute}`;
        
        let shortNameSpan: HTMLSpanElement = document.createElement("span");
        shortNameSpan.id = `attribute_label_name.${this.attribute}`;
        shortNameSpan.innerHTML = S_localisationManager.getString(`attribute.${this.attribute}.short_name`);
        this.H_labelName = shortNameSpan;

        let valueSpan: HTMLSpanElement = document.createElement("span");
        valueSpan.id = `attribute_label_value.${this.attribute}`;
        valueSpan.className = `attribute_grid_item_value`;
        valueSpan.innerHTML = this.value.toString();
        this.H_labelValue = valueSpan;

        container.append(shortNameSpan, ": ", valueSpan);

        return container;
    }

    updateTooltipSource(): string
    {
        return this.tooltip;
    }

    setTooltip(): string
    {
        return S_localisationManager.getString(`attribute.${this.attribute}.tooltip`);
    }
}