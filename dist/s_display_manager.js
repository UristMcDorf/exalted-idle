// Handles UI and stuff
// Switching between tabs, settings, etc
export class DisplayManager {
    constructor() {
        this.leftPanelTabs = new Map([
            ["abilities", { button: document.getElementById("left_main_panel.tab_button.abilities"), panel: document.getElementById("left_main_panel.tab.abilities") }],
            ["inventory", { button: document.getElementById("left_main_panel.tab_button.inventory"), panel: document.getElementById("left_main_panel.tab.inventory") }]
        ]);
        for (const [key, value] of this.leftPanelTabs) {
            value.button.addEventListener("click", evt => this.switchToTab("left", key));
        }
        this.middlePanelTabs = new Map([
            ["local", { button: document.getElementById("middle_main_panel.tab_button.local"), panel: document.getElementById("middle_main_panel.tab.local") }]
            // 
        ]);
        // currently unnecessary due to only one working tab in the mid
        // for(const [key, value] of this.middlePanelTabs)
        // {
        //     value.button.addEventListener("click", evt => this.switchToTab("middle", key));
        // }
        this.H_screenTint = document.getElementById(`screen_tint`);
        this.H_screenTint.addEventListener("click", evt => this.toggleScreenTintClick());
        this.screenTintSource = null;
        this.moneyDisplays = new Set();
    }
    switchToTab(category, tab) {
        switch (category) {
            case "left":
                for (const [key, value] of this.leftPanelTabs) {
                    const matches = (key == tab);
                    value.button.className = matches ? "tab_button tab_button_selected" : "tab_button tab_button_unselected";
                    value.panel.style.display = matches ? "block" : "none";
                }
                break;
            case "middle":
                for (const [key, value] of this.middlePanelTabs) {
                    const matches = (key == tab);
                    value.button.className = matches ? "tab_button tab_button_selected" : "tab_button tab_button_unselected";
                    value.panel.style.display = matches ? "block" : "none";
                }
                break;
        }
    }
    toggleScreenTint(screenTintSource = null) {
        this.screenTintSource = screenTintSource;
        this.H_screenTint.style.display = this.screenTintSource ? "block" : "none";
    }
    toggleScreenTintClick() {
        this.screenTintSource.toggle();
    }
    updateTheme(colorScheme) {
        for (const [key, value] of Object.entries(colorScheme)) {
            document.documentElement.style.setProperty(`--${key}`, `${value}`);
        }
    }
    // TODO: how to make temporary money displays dereferenced properly for GC when not in use?
    // So that I can use it for temp stuff like log entries
    // Right now a known issue will be that log entries etc will _not_ get updated with the setting
    registerMoneyDisplay(moneyDisplay) {
        this.moneyDisplays.add(moneyDisplay);
    }
    updateMoneyDisplays() {
        for (const moneyDisplay of this.moneyDisplays) {
            moneyDisplay.update();
        }
    }
}
