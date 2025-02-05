import { baseAttributeValue } from "../global_statics.js";
import { S_localisationManager, S_tooltip } from "../main.js";
import { ITooltipSource } from "../s_tooltip.js";

// ordered for the sake of easy table population lmao
export enum Attribute
{
    Physical = "physical",
    Social = "social",
    Mental = "mental"
}

export interface AttributeAdjuster
{
    attribute: Attribute;
    
    flat?: number;
    multi?: number;
}

export class AttributeContainer implements ITooltipSource
{
    H_container!: HTMLDivElement;
    H_labelName!: HTMLSpanElement;
    H_labelValue!: HTMLSpanElement;

    attribute: Attribute;
    tooltip: string;

    baseValue: number;
    value: number;

    adjustersFlat: Set<AttributeAdjuster>;
    adjustersMulti: Set<AttributeAdjuster>;

    constructor(attribute: Attribute, baseValue: number = baseAttributeValue)
    {
        this.attribute = attribute;
        this.baseValue = baseValue;
        this.value = baseValue;

        this.adjustersFlat = new Set<AttributeAdjuster>();
        this.adjustersMulti = new Set<AttributeAdjuster>();

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
        shortNameSpan.innerHTML = S_localisationManager.getString(`attribute.${this.attribute}.name`);
        this.H_labelName = shortNameSpan;

        let valueSpan: HTMLSpanElement = document.createElement("span");
        valueSpan.id = `attribute_label_value.${this.attribute}`;
        valueSpan.className = `attribute_value`;
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

    registerAttributeAdjuster(adjuster: AttributeAdjuster): void
    {
        if(`flat` in adjuster) this.adjustersFlat.add(adjuster);
        if(`multi` in adjuster) this.adjustersMulti.add(adjuster);
    }

    // unregistering applied when I need it, which is probably only after I introduce temp effects or somesuch

    recalculate(): void
    {
        this.value = this.baseValue;

        for(const adjuster of this.adjustersFlat)
        {
            this.value += adjuster.flat!;
        }

        for(const adjuster of this.adjustersMulti)
        {
            this.value *= adjuster.multi!;
        }

        this.updateDisplay();
    }

    updateDisplay(): void
    {
        this.H_labelValue.innerHTML = this.value.toString();
    }
}