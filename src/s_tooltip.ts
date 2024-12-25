import { IUpdates } from "./global_interfaces.js";
import { updatesList } from "./main.js";

export interface IStringUpdate
{
    updateStringSource(): string;
}

// TODO: make tooltip flip over to the other side if it's going out of bounds
export class Tooltip implements IUpdates
{
    stringSource: IStringUpdate | null;
    H_tooltipContainer: HTMLElement;

    constructor(H_tooltipContainer: HTMLElement = document.getElementById("tooltip")!)
    {
        this.stringSource = null;
        this.H_tooltipContainer = H_tooltipContainer;
        
        /* tooltip */
        window.onmousemove = function (e)
        {
            const offset: number = 20;
        
            H_tooltipContainer.style.top = (e.clientY + offset) + "px";
            H_tooltipContainer.style.left = (e.clientX + offset) + "px";
        }
        /* tooltip end */

        updatesList.add(this);
    }

    update(minutesPassed: number): void
    {
        if(this.stringSource)
        {
            this.H_tooltipContainer.innerHTML = this.stringSource.updateStringSource();
        }
    }

    setStringSource(stringSource: IStringUpdate): void
    {
        this.stringSource = stringSource;
        this.setVisibility(true);
        this.update(0);
    }

    setVisibility(value: boolean): void
    {
        if(value)
        {
            this.H_tooltipContainer.style.visibility = "visible";
        }
        else
        {
            this.H_tooltipContainer.style.visibility = "hidden";
            this.stringSource = null;
        }
    }
}