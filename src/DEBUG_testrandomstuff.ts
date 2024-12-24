// Intentionally doesn't follow my normal naming convention
// To more easily spot if it's, well, there

import { debugFlag } from "./main.js";
// import { yaml }

export async function DEBUG_TestRandomStuff()
{
    if(!debugFlag) return;

    try
    {
        const response = await fetch("./src/localisation/en/abilities_and_skills.json");

        if(!response.ok)
        {
            throw new Error(`Fetch request for "./src/localisation/en/abilities_and_skills.json", response status: ${response.status}`);
        }

        const text = await response.text();

        parseFromJSON(JSON.parse(text));
    }
    catch (error)
    {
        console.error((error as Error).message);
    }
}

function parseFromJSON(parsed: Object)
{
    for(const [key, value] of Object.entries(parsed))
    {
        recursiveAddEntry(key, value);
    }
}

function recursiveAddEntry(key: string, value: Object)
{
    if(typeof value === "string") // hacky but should be fine
    {
        console.log(`key: ${key}, value: ${value.toString()}`);
    }
    else
    {
        for(const [i_key, i_value] of Object.entries(value))
        {
            recursiveAddEntry(`${key}.${i_key}`, i_value);
        }
    }
}