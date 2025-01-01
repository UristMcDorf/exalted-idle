export const debugFlag = true; // just flip that to false for release
export const tickrate = 1000;
const saveLoadAbleList = new Map();
const updatesList = [];
/* BEGIN - HTML ELEMENTS CONSTANT REFERENCES */
/* begin with H_ for HTML*/
export const H_actionsContainer = document.getElementById("actions_container");
/* END - HTML ELEMENTS CONSTANT REFERENCES */
/* BEGIN - SINGLETON CONSTANT REFERENCES */
/* begin with S_ for Singleton */
import { LocalisationManager } from "./localisation/s_localisation_manager.js";
export const S_localisationManager = new LocalisationManager();
import { GameTimeManager } from "./time/s_game_time_manager.js";
const S_gameTime = new GameTimeManager();
import { LocationManager } from "./locations/s_location_manager.js";
export const S_locationManager = new LocationManager();
import { LogManager } from "./s_log_manager.js";
export const S_logManager = new LogManager();
import { CharacterStateManager } from "./s_character_state_manager.js";
const S_characterStateManager = new CharacterStateManager();
import { StatManager } from "./stats/s_stat_manager.js";
export const S_statManager = new StatManager();
import { Tooltip } from "./s_tooltip.js";
import { DEBUG_TestRandomStuff } from "./DEBUG_testrandomstuff.js";
export const S_tooltip = new Tooltip();
/* END - SINGLETON CONSTANT REFERENCES */
// initial setup goes here
function run() {
    saveLoadAbleList.set(S_gameTime.saveId, S_gameTime);
    saveLoadAbleList.set(S_statManager.saveId, S_statManager);
    saveLoadAbleList.set(S_locationManager.saveId, S_locationManager);
    updatesList.push(S_gameTime);
    updatesList.push(S_locationManager);
    updatesList.push(S_characterStateManager);
    updatesList.push(S_tooltip);
    document.getElementById("save_button").addEventListener("click", evt => save());
    document.getElementById("load_button").addEventListener("click", evt => load());
    debugFlag ? document.getElementById("debug_clear_button").addEventListener("click", evt => clearSave()) : document.getElementById("debug_clear_button").remove();
    load();
    update();
}
function update() {
    for (let i = 0; i < updatesList.length; i++) {
        updatesList[i].update();
    }
    setTimeout(update, tickrate); // can probably be done in a better way!
}
export function getTickRateMultiplier() {
    return 1; // TODO duh
}
function save() {
    let data = "";
    for (const [key, value] of saveLoadAbleList.entries()) {
        data += `"${key}":${value.save()},`;
    }
    localStorage.setItem("local_save", `{${data.slice(0, -1)}}`);
}
function load() {
    let sourceString = localStorage.getItem("local_save");
    if (sourceString === null) {
        return; // no save yet
    }
    let map = new Map(Object.entries(JSON.parse(sourceString)));
    for (const [key, value] of map.entries()) {
        let saveLoadAble = saveLoadAbleList.get(key);
        if (saveLoadAble === undefined) {
            console.error(`Failed to access ISaveLoadAble by id: ${key}`);
            continue;
        }
        saveLoadAble.load(value);
    }
    return;
}
function clearSave() {
    localStorage.clear();
}
// START
run();
DEBUG_TestRandomStuff();
