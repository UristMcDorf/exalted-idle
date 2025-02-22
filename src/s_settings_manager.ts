import { ColorSchemes } from "./color_schemes.js";
import { ISaveLoadAble, IScreenTintSource } from "./global_interfaces.js";
import { S_displayManager, saveLoadAbleList } from "./main.js";

export class SettingsManager implements ISaveLoadAble, IScreenTintSource
{
    H_settingsPanel: HTMLElement;

    settingsPanelVisible: boolean;

    saveId: string = "settings";

    theme: string;
    thematicMoneyDisplay: boolean;

    constructor(theme: string = "orichalcum", thematicMoneyDisplay: boolean = false)
    {
        this.theme = theme;
        this.thematicMoneyDisplay = thematicMoneyDisplay;

        this.settingsPanelVisible = false;

        this.H_settingsPanel = document.getElementById("settings_panel")!;

        document.getElementById(`settings_button`)!.addEventListener("click", evt => this.toggle());
        document.getElementById(`settings.theme.select`)!.addEventListener("change", evt => this.updateTheme((<any>evt.target!).value)); // ugly bleh
        // document.getElementById(`settings.money_display.input`)!.addEventListener("input", evt => this.updateMoneyDisplays());

        saveLoadAbleList.add(this);
    }

    save(): string
    {
        // will do for now, obviously adjusted later as more settings get added
        return `{"theme": "${this.theme}", "thematic_money_display": ${this.thematicMoneyDisplay} }`;
    }

    load(data: Object): boolean
    {
        let returnValue: boolean = true;
    
        for(const [key, value] of Object.entries(data))
        {
            switch(key)
            {
                case "theme":
                    this.updateTheme(value);

                    for(const [t_key, t_value] of ColorSchemes)
                    {
                        (document.getElementById(`settings.theme.option.${t_key}`)! as HTMLOptionElement).selected = (t_key == this.theme) ? true : false;
                    }

                    break;
                case "thematic_money_display":
                    this.updateMoneyDisplays(<boolean>value);

                    (<HTMLInputElement>document.getElementById(`settings.money_display.input`)!).checked = <boolean>value;

                    break;
            }
        }

        return returnValue;
    }

    updateTheme(theme: string): void
    {
        this.theme = theme;

        S_displayManager.updateTheme(ColorSchemes.get(this.theme)!);
    }

    // part of why I'm doing this through bool instead of list of options like with theme
    // is because I need to learn how do that :)
    updateMoneyDisplays(value: boolean = (<HTMLInputElement>document.getElementById(`settings.money_display.input`)!).checked): void
    {
        this.thematicMoneyDisplay = value;

        S_displayManager.updateMoneyDisplays();
    }

    toggle(): void
    {
        this.settingsPanelVisible = !this.settingsPanelVisible;
        this.H_settingsPanel.style.display = this.settingsPanelVisible ? "block" : "none";

        S_displayManager.toggleScreenTint(this.settingsPanelVisible ? this : null);
    }
}