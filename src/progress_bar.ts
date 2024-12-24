import { S_localisationManager } from "./main.js";

export class ProgressBar
{
    id: string;
    label: string | null;
    value: number;
    maxValue: number;

    H_label: HTMLElement | null;
    H_filledPortion: HTMLElement;
    H_missingPortion: HTMLElement;

    constructor(id: string, value: number = 100, maxValue: number = 100, H_filledPortion?: HTMLElement, H_missingPortion?: HTMLElement, H_label?: HTMLElement | null)
    {
        this.id = id;
        this.value = value;
        this.maxValue = maxValue;

        // we either pass them directly
        if(H_filledPortion && H_missingPortion)
        {
            this.label = H_label ? S_localisationManager.getString(`bar_label.${id}`) : null;
            this.H_label = H_label ? document.getElementById(`progress_bar_label.${id}`)! : null;

            this.H_filledPortion = H_filledPortion;
            this.H_missingPortion = H_missingPortion;
        }
        // or find them on our own
        else
        {
            this.H_label = document.getElementById(`progress_bar_label.${id}`);
            this.label = this.H_label ? S_localisationManager.getString(`bar_label.${id}`) : null;

            this.H_filledPortion = document.getElementById(`progress_bar_filled.${id}`)!;
            this.H_missingPortion = document.getElementById(`progress_bar_missing.${id}`)!;
        }
    }

    update(): void
    {
        let filledAmount: number = Math.round(this.value * 100 / this.maxValue);

        this.H_filledPortion.style.flex = filledAmount + "%";
        this.H_missingPortion.style.flex = (100 - filledAmount) + "%";

        if(this.H_label)
        {
            this.H_label.innerHTML = `${this.label}: ${Math.round(this.value * 100) / 100}/${this.maxValue}`;
        }
    }

    addValue(value: number)
    {
        this.setValue(this.value + value);
    }

    setValue(value: number, maxValue: number | null = null): void
    {
        this.value = value;

        if(maxValue)
        {
            this.maxValue = maxValue;
        }

        this.update();
    }
}