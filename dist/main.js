import { autoSaveInterval, tickrate, version } from "./global_statics.js";
import { LocalisationManager } from "./localisation/s_localisation_manager.js";
import { GameTimeManager } from "./time/s_game_time_manager.js";
import { LocationManager } from "./locations/s_location_manager.js";
import { LogManager } from "./s_log_manager.js";
import { CharacterStateManager } from "./s_character_state_manager.js";
import { StatManager } from "./stats/s_stat_manager.js";
import { DisplayManager } from "./s_display_manager.js";
import { Tooltip } from "./s_tooltip.js";
import { InventoryManager } from "./items/s_inventory_manager.js";
import { SettingsManager } from "./s_settings_manager.js";
import { DebugManager } from "./s_debug_manager.js";
import { CombatManager } from "./s_combat_manager.js";
export const saveLoadAbleList = new Set();
export const updatesList = new Set();
/* BEGIN - HTML ELEMENTS CONSTANT REFERENCES */
// currently none
/* begin with H_ for HTML*/
/* END - HTML ELEMENTS CONSTANT REFERENCES */
/* BEGIN - SINGLETON CONSTANT REFERENCES */
/* begin with S_ for Singleton */
export const S_localisationManager = new LocalisationManager();
await loadLocalisation(); // must be done before the others because they rely on it to provide strings
// TODO: initialise with loaded values for ISaveLoadAbles
// HIGHER PRIORITY now that themes are in
export const S_settingsManager = new SettingsManager();
export const S_displayManager = new DisplayManager();
export const S_gameTimeManager = new GameTimeManager();
export const S_logManager = new LogManager();
export const S_characterStateManager = new CharacterStateManager();
export const S_statManager = new StatManager();
export const S_locationManager = new LocationManager();
export const S_tooltip = new Tooltip();
export const S_inventoryManager = new InventoryManager();
export const S_debugManager = new DebugManager();
export const S_combatManager = new CombatManager();
/* END - SINGLETON CONSTANT REFERENCES */
// initial setup goes here
function run() {
    document.getElementById(`save_button`).addEventListener(`click`, evt => saveLocal());
    // document.getElementById("load_button")!.addEventListener("click", evt => loadLocal());
    document.getElementById(`export_button`).addEventListener(`click`, evt => saveExport());
    document.getElementById(`import_file`).addEventListener(`change`, evt => loadImport(evt));
    loadLocal();
    setTimeout(autoSave, autoSaveInterval);
    update();
}
function update() {
    const minutesPassed = S_gameTimeManager.update();
    for (const updates of updatesList) {
        updates.update(minutesPassed);
    }
    // TODO: might want to separate gametime updates and display updates
    setTimeout(update, tickrate); // can probably be done in a better way!
}
function saveLocal() {
    localStorage.setItem("local_save", makeSaveString());
}
function saveExport() {
    const a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([makeSaveString()], { type: `application/JSON` })); // no, I don't bother with encoding
    a.download = `exalted-idle ${Date.now()} save.json`; // TODO: parse date into human-readable
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function makeSaveString() {
    let data = `"version":"${version}",`;
    for (const saveLoadAble of saveLoadAbleList) {
        data += `"${saveLoadAble.saveId}":${saveLoadAble.save()},`;
    }
    return `{${data.slice(0, -1)}}`;
}
function loadLocal() {
    const sourceString = localStorage.getItem("local_save");
    if (sourceString === null) {
        return; // no save yet
    }
    loadFromString(sourceString);
    return;
}
function loadImport(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        loadFromString(reader.result);
    };
    reader.readAsText(file);
    event.target.value = ""; // apparently to allow loading the same file more than once
}
function loadFromString(data) {
    const map = new Map(Object.entries(JSON.parse(data)));
    if (map.get("version") != version) {
        deepLoad(data);
    }
    for (const saveLoadAble of saveLoadAbleList) {
        const data = map.get(saveLoadAble.saveId);
        if (data === undefined) {
            console.warn(`No save data for "${saveLoadAble.saveId}".`);
            continue;
        }
        saveLoadAble.load(data);
    }
}
function deepLoad(data) {
    // stub for when versions change enough to warrant save maintenance
    // and IG an update popup?
}
async function loadLocalisation() {
    await S_localisationManager.loadLanguage("en");
}
function autoSave() {
    saveLocal();
    setTimeout(autoSave, autoSaveInterval);
}
// START
run();
