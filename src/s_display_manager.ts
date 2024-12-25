// Handles UI and stuff
// Switching between tabs, settings, etc

interface TabPanelPair
{
    button: HTMLElement;
    panel: HTMLElement;
}

export class DisplayManager
{
    leftPanelTabs: Map<string, TabPanelPair>;
    middlePanelTabs: Map<string, TabPanelPair>;

    constructor()
    {
        this.leftPanelTabs = new Map<string, TabPanelPair>([
            ["abilities", { button: document.getElementById("left_main_panel.tab_button.abilities")!, panel: document.getElementById("left_main_panel.tab.abilities")! }],
            ["inventory", { button: document.getElementById("left_main_panel.tab_button.inventory")!, panel: document.getElementById("left_main_panel.tab.inventory")! }]
        ]);
        
        for(const [key, value] of this.leftPanelTabs)
        {
            value.button.addEventListener("click", evt => this.switchToTab("left", key));
        }

        this.middlePanelTabs = new Map<string, TabPanelPair>([
            ["local", { button: document.getElementById("middle_main_panel.tab_button.local")!, panel: document.getElementById("middle_main_panel.tab.local")! }]
            // 
        ]);

        // currently unnecessary due to only one working tab in the mid
        // for(const [key, value] of this.middlePanelTabs)
        // {
        //     value.button.addEventListener("click", evt => this.switchToTab("middle", key));
        // }
    }

    switchToTab(category: string, tab: string)
    {
        switch(category)
        {
            case "left":
                for(const [key, value] of this.leftPanelTabs)
                {
                    const matches: boolean = (key == tab);

                    value.button.className = matches ? "tab_button tab_button_selected" : "tab_button tab_button_unselected";
                    value.panel.style.display = matches ? "block" : "none";
                }
                break;
            case "middle":
                for(const [key, value] of this.middlePanelTabs)
                {
                    const matches: boolean = (key == tab);

                    value.button.className = matches ? "tab_button tab_button_selected" : "tab_button tab_button_unselected";
                    value.panel.style.display = matches ? "block" : "none";
                }
                break;
        }
    }
}