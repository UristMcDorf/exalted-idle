import { updatesList } from "./main.js";
// TODO: make tooltip flip over to the other side if it's going out of bounds
export class Tooltip {
    constructor(H_tooltipContainer = document.getElementById("tooltip")) {
        this.tooltipSource = null;
        this.H_tooltipContainer = H_tooltipContainer;
        /* tooltip */
        window.onmousemove = function (e) {
            const offset = 20;
            H_tooltipContainer.style.top = (e.clientY + offset) + "px";
            H_tooltipContainer.style.left = (e.clientX + offset) + "px";
        };
        /* tooltip end */
        updatesList.add(this);
    }
    update(minutesPassed) {
        if (this.tooltipSource) {
            this.H_tooltipContainer.innerHTML = this.tooltipSource.updateTooltipSource();
        }
    }
    setTooltipSource(tooltipSource) {
        this.tooltipSource = tooltipSource;
        this.setVisibility(true);
        this.update(0);
    }
    setVisibility(value) {
        if (value) {
            this.H_tooltipContainer.style.visibility = "visible";
        }
        else {
            this.H_tooltipContainer.style.visibility = "hidden";
            this.tooltipSource = null;
        }
    }
}
