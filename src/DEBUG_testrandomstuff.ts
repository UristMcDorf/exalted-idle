// Intentionally doesn't follow my normal naming convention
// To more easily spot if it's, well, there

import { ColorSchemes } from "./color_schemes.js";
import { debugFlag } from "./global_statics.js";
import { S_inventoryManager } from "./main.js";
// import { yaml }

let isOrichalcum: boolean = false;

export async function DEBUG_TestRandomStuff()
{
    if(!debugFlag) return;

    for(const [key, value] of Object.entries(ColorSchemes.get(isOrichalcum ? "soulsteel" : "orichalcum")!))
    {
        document.documentElement.style.setProperty(`--${key}`, `${value}`);
    }

    isOrichalcum = !isOrichalcum;
}