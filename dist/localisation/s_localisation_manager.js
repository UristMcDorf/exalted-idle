// TODO: see how to automagically turn yaml into json on build
export class LocalisationManager {
    constructor() {
        this.language = "none";
        this.strings = new Map();
    }
    getString(id) {
        var _a;
        return (_a = this.strings.get(id)) !== null && _a !== void 0 ? _a : "LOC_MANAGER: String not found: " + id;
    }
    async loadLanguage(language) {
        if (this.language == language)
            return; //already loaded
        this.language = language;
        this.strings = new Map();
        // TODO: iteratable list
        await this.loadJSONSource("abilities_and_skills");
        await this.loadJSONSource("attributes");
        await this.loadJSONSource("locations_and_actions");
        await this.loadJSONSource("misc_ui");
        await this.loadJSONSource("items");
        await this.loadJSONSource("combat");
    }
    async loadJSONSource(fileName) {
        const path = `./src/localisation/${this.language}/${fileName}.json`;
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Fetch request for "${path}", response status: ${response.status}`);
            }
            const text = await response.text();
            this.parseFromJSON(JSON.parse(text));
        }
        catch (error) {
            console.error(error.message);
        }
    }
    parseFromJSON(parsed) {
        for (const [key, value] of Object.entries(parsed)) {
            this.recursiveAddEntry(key, value);
        }
    }
    recursiveAddEntry(key, value) {
        if (typeof value === "string") // a bit hacky but this should reach the bottom level of the json
         {
            this.strings.set(key, value);
        }
        else {
            for (const [i_key, i_value] of Object.entries(value)) {
                this.recursiveAddEntry(`${key}.${i_key}`, i_value);
            }
        }
    }
}
