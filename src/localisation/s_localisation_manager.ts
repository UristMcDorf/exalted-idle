// TODO: see how to automagically turn yaml into json on build

export class LocalisationManager
{
    language: string;
    strings: Map<string, string>;

    constructor()
    {
        this.language = "none";
        this.strings = new Map<string, string>();
    }

    getString(id: string): string
    {
        return this.strings.get(id) ?? "LOC_MANAGER: String not found: " + id;
    }

    async loadLanguage(language: string)
    {
        if(this.language == language) return; //already loaded

        this.language = language;

        this.strings = new Map<string, string>();

        // TODO: iteratable list
        await this.loadJSONSource("abilities_and_skills");
        await this.loadJSONSource("attributes");
        await this.loadJSONSource("locations_and_actions");
        await this.loadJSONSource("misc_ui");
    }

    async loadJSONSource(fileName: string)
    {
        const path: string = `./src/localisation/${this.language}/${fileName}.json`;

        try
        {
            const response = await fetch(path);
    
            if(!response.ok)
            {
                throw new Error(`Fetch request for "${path}", response status: ${response.status}`);
            }
    
            const text = await response.text();
    
            this.parseFromJSON(JSON.parse(text));
        }
        catch (error)
        {
            console.error((error as Error).message);
        }
    }

    parseFromJSON(parsed: Object)
    {
        for(const [key, value] of Object.entries(parsed))
        {
            this.recursiveAddEntry(key, value);
        }
    }

    recursiveAddEntry(key: string, value: Object)
    {
        if(typeof value === "string") // a bit hacky but this should reach the bottom level of the json
        {
            this.strings.set(key, value);
        }
        else
        {
            for(const [i_key, i_value] of Object.entries(value))
            {
                this.recursiveAddEntry(`${key}.${i_key}`, i_value);
            }
        }
    }
}