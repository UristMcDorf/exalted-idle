import { S_localisationManager } from "./main.js";
export class ProgressBar {
    constructor(id, value = 100, maxValue = 100, H_filledPortion, H_missingPortion, H_label) {
        this.id = id;
        this.value = value;
        this.maxValue = maxValue;
        // we either pass them directly
        if (H_filledPortion && H_missingPortion) {
            this.label = H_label ? S_localisationManager.getString(`bar_label.${id}`) : null;
            this.H_label = H_label ? document.getElementById(`progress_bar_label.${id}`) : null;
            this.H_filledPortion = H_filledPortion;
            this.H_missingPortion = H_missingPortion;
        }
        // or find them on our own
        else {
            this.H_label = document.getElementById(`progress_bar_label.${id}`);
            this.label = this.H_label ? S_localisationManager.getString(`bar_label.${id}`) : null;
            this.H_filledPortion = document.getElementById(`progress_bar_filled.${id}`);
            this.H_missingPortion = document.getElementById(`progress_bar_missing.${id}`);
        }
    }
    update() {
        let filledAmount = Math.round(this.value * 100 / this.maxValue);
        this.H_filledPortion.style.flex = filledAmount + "%";
        this.H_missingPortion.style.flex = (100 - filledAmount) + "%";
        if (this.H_label) {
            this.H_label.innerHTML = `${this.label}: ${Math.round(this.value * 100) / 100}/${this.maxValue}`;
        }
    }
    addValue(value) {
        this.setValue(this.value + value);
    }
    setValue(value, maxValue = null) {
        this.value = value;
        if (maxValue) {
            this.maxValue = maxValue;
        }
        this.update();
    }
}
