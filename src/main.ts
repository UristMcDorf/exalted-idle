import { IUpdates, ISaveLoadAble } from "./global_interfaces.js";
import { DEBUG_TestRandomStuff } from "./DEBUG_testrandomstuff.js";
import { debugFlag, tickrate } from "./global_statics.js";

import { LocalisationManager } from "./localisation/s_localisation_manager.js"
import { GameTimeManager } from "./time/s_game_time_manager.js";
import { LocationManager } from "./locations/s_location_manager.js";
import { LogManager } from "./s_log_manager.js";
import { CharacterStateManager } from "./s_character_state_manager.js";
import { StatManager } from "./stats/s_stat_manager.js";
import { DisplayManager } from "./s_display_manager.js";
import { Tooltip } from "./s_tooltip.js";

export const saveLoadAbleList: Map<string, ISaveLoadAble> = new Map<string, ISaveLoadAble>();
export const updatesList: Set<IUpdates> = new Set<IUpdates>();

/* BEGIN - HTML ELEMENTS CONSTANT REFERENCES */
// currently none
/* begin with H_ for HTML*/

/* END - HTML ELEMENTS CONSTANT REFERENCES */

/* BEGIN - SINGLETON CONSTANT REFERENCES */
/* begin with S_ for Singleton */

export const S_localisationManager: LocalisationManager = new LocalisationManager();
await loadLocalisation(); // must be done before the others because they rely on it to provide strings

export const S_gameTimeManager: GameTimeManager = new GameTimeManager();
export const S_logManager: LogManager = new LogManager();
export const S_characterStateManager: CharacterStateManager = new CharacterStateManager();
export const S_statManager: StatManager = new StatManager();
export const S_locationManager: LocationManager = new LocationManager();
export const s_displayManager: DisplayManager = new DisplayManager();
export const S_tooltip: Tooltip = new Tooltip();

/* END - SINGLETON CONSTANT REFERENCES */

// initial setup goes here
function run()
{
    document.getElementById("save_button")!.addEventListener("click", evt => save());
    document.getElementById("load_button")!.addEventListener("click", evt => load());

    debugFlag ? document.getElementById("debug_clear_button")!.addEventListener("click", evt => clearSave()) : document.getElementById("debug_clear_button")!.remove();
    debugFlag ? document.getElementById("debug_run_debug_function")!.addEventListener("click", evt => DEBUG_TestRandomStuff()) : document.getElementById("debug_run_debug_function")!.remove();

    load();

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

function save(): void
{
    let data: string = "";

    for(const [key, value] of saveLoadAbleList.entries())
    {
        data += `"${key}":${value.save()},`
    }

    localStorage.setItem("local_save", `{${data.slice(0, -1)}}`);
}

async function loadLocalisation()
{
    await S_localisationManager.loadLanguage("en");
}

function load(): void
{
    let sourceString: string | null = localStorage.getItem("local_save");

    if(sourceString === null)
    {
        return; // no save yet
    }

    let map = new Map(Object.entries(JSON.parse(sourceString)));

    for(const [key, value] of map.entries())
    {
        let saveLoadAble: ISaveLoadAble | undefined = saveLoadAbleList.get(key);

        if(saveLoadAble === undefined)
        {
            console.error(`Failed to access ISaveLoadAble by id: ${key}`);

            continue;
        }

        saveLoadAble.load(value as Object);
    }

    return;
}

function clearSave(): void
{
    localStorage.clear();
}

// START
run();

export { debugFlag };
