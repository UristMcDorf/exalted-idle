import { IUpdates, ISaveLoadAble } from "./global_interfaces.js";
import { DEBUG_TestRandomStuff } from "./DEBUG_testrandomstuff.js";
import { debugFlag, tickrate, version } from "./global_statics.js";

import { LocalisationManager } from "./localisation/s_localisation_manager.js"
import { GameTimeManager } from "./time/s_game_time_manager.js";
import { LocationManager } from "./locations/s_location_manager.js";
import { LogManager } from "./s_log_manager.js";
import { CharacterStateManager } from "./s_character_state_manager.js";
import { StatManager } from "./stats/s_stat_manager.js";
import { DisplayManager } from "./s_display_manager.js";
import { Tooltip } from "./s_tooltip.js";
import { InventoryManager } from "./items/s_inventory_manager.js";

export const saveLoadAbleList: Set<ISaveLoadAble> = new Set<ISaveLoadAble>();
export const updatesList: Set<IUpdates> = new Set<IUpdates>();

/* BEGIN - HTML ELEMENTS CONSTANT REFERENCES */
// currently none
/* begin with H_ for HTML*/

/* END - HTML ELEMENTS CONSTANT REFERENCES */

/* BEGIN - SINGLETON CONSTANT REFERENCES */
/* begin with S_ for Singleton */

export const S_localisationManager: LocalisationManager = new LocalisationManager();
await loadLocalisation(); // must be done before the others because they rely on it to provide strings

// TODO: initialise with loaded values for ISaveLoadAbles
export const S_gameTimeManager: GameTimeManager = new GameTimeManager();
export const S_logManager: LogManager = new LogManager();
export const S_characterStateManager: CharacterStateManager = new CharacterStateManager();
export const S_statManager: StatManager = new StatManager();
export const S_locationManager: LocationManager = new LocationManager();
export const s_displayManager: DisplayManager = new DisplayManager();
export const S_tooltip: Tooltip = new Tooltip();
export const S_inventoryManager: InventoryManager = new InventoryManager();

/* END - SINGLETON CONSTANT REFERENCES */

// initial setup goes here
function run()
{
    document.getElementById("save_button")!.addEventListener("click", evt => saveLocal());
    document.getElementById("load_button")!.addEventListener("click", evt => loadLocal());
    document.getElementById("export_button")!.addEventListener("click", evt => saveExport());
    document.getElementById("import_file")!.addEventListener("change", evt => loadImport(evt));

    debugFlag ? document.getElementById("debug_clear_button")!.addEventListener("click", evt => clearSave()) : document.getElementById("debug_clear_button")!.remove();
    debugFlag ? document.getElementById("debug_run_debug_function")!.addEventListener("click", evt => DEBUG_TestRandomStuff()) : document.getElementById("debug_run_debug_function")!.remove();

    loadLocal();

    update();
}

function update(): void
{
    const minutesPassed = S_gameTimeManager.update();

    for(const updates of updatesList)
    {
        updates.update(minutesPassed);
    }

    // TODO: might want to separate gametime updates and display updates
    setTimeout(update, tickrate); // can probably be done in a better way!
}

function saveLocal(): void
{
    localStorage.setItem("local_save", makeSaveString());
}

function saveExport(): void
{
    const a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([makeSaveString()], { type: `application/JSON` })); // no, I don't bother with encoding
    a.download = `exalted-idle ${Date.now()} save.json`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function makeSaveString(): string
{
    let data: string = `"version":"${version}",`;

    for(const saveLoadAble of saveLoadAbleList)
    {
        data += `"${saveLoadAble.saveId}":${saveLoadAble.save()},`
    }

    return `{${data.slice(0, -1)}}`;
}

function loadLocal(): void
{
    const sourceString: string | null = localStorage.getItem("local_save");

    if(sourceString === null)
    {
        return; // no save yet
    }

    loadFromString(sourceString);

    return;
}

function loadImport(event: Event): void
{
    const file: File = (event.target as HTMLInputElement).files![0];
    const reader: FileReader = new FileReader();

    reader.onload = function()
    {
        loadFromString(reader.result as string);
    }

    reader.readAsText(file);

    (event.target as HTMLInputElement).value = ""; // apparently to allow loading the same file more than once
}

function loadFromString(data: string): void
{
    const map = new Map(Object.entries(JSON.parse(data)));

    if(map.get("version") as string != version)
    {
        deepLoad(data);
    }

    for(const saveLoadAble of saveLoadAbleList)
    {
        const data: Object | unknown | undefined = map.get(saveLoadAble.saveId);

        if(data === undefined)
        {
            console.warn(`No save data for "${saveLoadAble.saveId}".`)
            continue;
        }

        saveLoadAble.load(data!);
    }
}

function deepLoad(data: string): void
{
    // stub for when versions change enough to warrant save maintenance
    // and IG an update popup?
}

async function loadLocalisation()
{
    await S_localisationManager.loadLanguage("en");
}

function clearSave(): void
{
    localStorage.clear();
}

// START
run();
