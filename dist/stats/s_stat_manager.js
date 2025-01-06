import { Skill } from "./skills.js";
import { AbilityContainer } from "./abilities.js";
import { Ability } from "./abilities.js";
import { Attribute, AttributeContainer } from "./attributes.js";
import { DB_Skill } from "./db/skill_db.js";
import { saveLoadAbleList } from "../main.js";
export class StatManager {
    constructor() {
        // ISaveLoadAble implementation block
        // Incidentally since attributes are derived values they do not need loading
        // Abilities are the fixed 25-some list
        // So just need the skills
        this.saveId = "stat_manager";
        // TODO: only create skill containers when necessary? Will get bloated and inefficient otherwise, possibly
        const H_abilitiesPane = document.getElementById(`abilities_pane`);
        this.abilityList = new Map();
        Object.values(Ability).forEach((value) => {
            const abilityContainer = new AbilityContainer(value);
            this.abilityList.set(value, abilityContainer);
            H_abilitiesPane.appendChild(abilityContainer.H_container);
        });
        this.skillList = new Map();
        for (const dbEntry of DB_Skill) {
            this.skillList.set(dbEntry.id, new Skill(dbEntry.id, this.abilityList.get(dbEntry.ability), dbEntry.maxLevel, dbEntry.baseXpPerLevel, dbEntry.xpScaling, dbEntry.perks));
        }
        // TODO redo when I move skill list off constructor; move attachSkillContainer call back to Skill init
        for (const [key, value] of this.skillList.entries()) {
            this.attachSkillContainer(value);
        }
        // checking if any of the super skills should be made visible
        // ...later, when I add save/load
        const H_attributeContainer = document.getElementById("attribute_grid");
        this.attributeList = new Map();
        Object.values(Attribute).forEach((value) => {
            const attributeContainer = new AttributeContainer(value);
            this.attributeList.set(value, attributeContainer);
            H_attributeContainer.appendChild(attributeContainer.H_container);
        });
        saveLoadAbleList.add(this);
    }
    gainSkill(id, amount) {
        this.skillList.get(id).addXp(amount);
    }
    attachSkillContainer(skill) {
        this.abilityList.get(skill.ability).H_container.appendChild(skill.H_container);
    }
    save() {
        let data = "";
        for (const [key, value] of this.skillList) {
            data += `"${key}":${value.lifetimeXp},`;
        }
        return `{${data.slice(0, -1)}}`;
    }
    load(data) {
        let returnValue = true;
        let map = new Map(Object.entries(data));
        for (const [key, value] of map) {
            let skill = this.skillList.get(key);
            if (skill === undefined) {
                console.error(`Failed to load skill: ${key}`);
                returnValue = false;
                continue;
            }
            skill.import(value);
        }
        return returnValue;
    }
}
