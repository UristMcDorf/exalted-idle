// Intentionally doesn't follow my normal naming convention
// To more easily spot if it's, well, there
import { debugFlag } from "./global_statics.js";
import { S_statManager } from "./main.js";
// import { yaml }
export async function DEBUG_TestRandomStuff() {
    if (!debugFlag)
        return;
    S_statManager.gainSkill("timekeeping", 2000);
}
