import { Skill } from "./skills.js";
import { AbilityContainer } from "./abilities.js";
import { Ability } from "./abilities.js";
import { Attribute, AttributeContainer } from "./attributes.js";
import { ISaveLoadAble } from "../global_interfaces.js";
import { DB_Skill, SkillDBEntry } from "./db/skill_db.js";

export class StatManager implements ISaveLoadAble
{
    abilityList: Map<Ability, AbilityContainer>;
    skillList: Map<string, Skill>;

    attributeList: Map<Attribute, AttributeContainer>;

    constructor()
    {
        const H_skillPane: HTMLElement = document.getElementById("skill_pane")!;

        this.abilityList = new Map<Ability, AbilityContainer>();

        Object.values(Ability).forEach((value) =>
        {
            const abilityContainer: AbilityContainer = new AbilityContainer(value);

            this.abilityList.set(value, abilityContainer);

            H_skillPane.appendChild(abilityContainer.H_container);
        })

        this.skillList = new Map<string, Skill>();
        
        for(const dbEntry of DB_Skill)
        {
            this.skillList.set(dbEntry.id, new Skill(dbEntry.id, this.abilityList.get(dbEntry.ability)!, dbEntry.maxLevel, dbEntry.baseXpPerLevel, dbEntry.xpScaling));
        }

        // TODO redo when I move skill list off constructor; move attachSkillContainer call back to Skill init
        for(const [key, value] of this.skillList.entries())
        {
            this.attachSkillContainer(value);
        }

        // checking if any of the super skills should be made visible
        // ...later, when I add save/load

        const H_attributeContainer: HTMLElement = document.getElementById("attribute_grid")!;
        
        this.attributeList = new Map<Attribute, AttributeContainer>();

        Object.values(Attribute).forEach((value) =>
        {
            const attributeContainer: AttributeContainer = new AttributeContainer(value);

            this.attributeList.set(value, attributeContainer);

            H_attributeContainer.appendChild(attributeContainer.H_container);
        })
    }

    gainSkill(id: string, amount: number)
    {
        this.skillList.get(id)!.addXp(amount);
    }

    attachSkillContainer(skill: Skill)
    {
        this.abilityList.get(skill.ability)!.H_container.appendChild(skill.H_container);
    }

    // ISaveLoadAble implementation block
    // Incidentally since attributes are derived values they do not need loading
    // Abilities are the fixed 25-some list
    // So just need the skills

    saveId: string = "stat_manager";
    
    save(): string
    {
        let data: string = "";

        for(const [key, value] of this.skillList.entries())
        {
            data += `"${key}":${value.lifetimeXp},`
        }

        return `{${data.slice(0, -1)}}`;
    }

    load(data: Object): boolean
    {
        let map = new Map(Object.entries(data));

        for(const [key, value] of map.entries())
        {
            let skill: Skill | undefined = this.skillList.get(key);

            if(skill === undefined)
            {
                console.error(`Failed to load skill: ${key}`);

                return false;
            }

            skill.import(value as number);
        }

        return true;
    }
}