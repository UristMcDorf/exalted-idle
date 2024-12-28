import { ColorSchemes } from "./color_schemes.js";
import { ISaveLoadAble } from "./global_interfaces.js";
import { saveLoadAbleList } from "./main.js";

export class SettingsManager implements ISaveLoadAble
{
    H_settingsPanel: HTMLElement;

    settingsPanelVisible: boolean;

    saveId: string = "settings";
    theme: string;

    constructor(theme: string = "orichalcum")
    {
        this.theme = theme;
        this.settingsPanelVisible = false;

        this.H_settingsPanel = document.getElementById("settings_panel")!;

        document.getElementById(`settings_button`)!.addEventListener("click", evt => this.toggleSettingsPanel());
        document.getElementById(`settings.theme.select`)!.addEventListener("change", evt => this.updateTheme((evt.target! as any).value)); // ugly bleh

        saveLoadAbleList.add(this);
    }

    save(): string
    {
        // will do for now, obviously adjusted later as more settings get added
        return `{"theme": "${this.theme}"}`;
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
            }
        }

        return returnValue;
    }

    updateTheme(theme: string): void
    {
        this.theme = theme;

        for(const [key, value] of Object.entries(ColorSchemes.get(this.theme)!))
        {
            document.documentElement.style.setProperty(`--${key}`, `${value}`);
        }
    }

    toggleSettingsPanel(): void
    {
        this.settingsPanelVisible = !this.settingsPanelVisible;
        this.H_settingsPanel.style.display = this.settingsPanelVisible ? "block" : "none";
    }
}