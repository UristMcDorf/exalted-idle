// import en from "./en/strings.yaml";
// import * as YAML from "../../node_modules/yaml/dist/index.js"; // ugh
// THIS IS WROOOOOOOONG
import { en } from "./en/strings.js";
export class LocalisationManager {
    constructor(language = "en") {
        this.language = "en";
        this.strings = LocalisationManager.LoadLanguage(language);
    }
    static LoadLanguage(language) {
        switch (language) {
            case "en":
            default:
                return en;
        }
    }
    GetString(id) {
        var _a;
        return (_a = this.strings.get(id)) !== null && _a !== void 0 ? _a : "LOC_MANAGER: String not found: " + id;
    }
}
