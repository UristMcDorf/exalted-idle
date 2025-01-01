import { Skill } from "./skills.js";
import { AbilityContainer } from "./abilities.js";
import { Ability } from "./abilities.js";
export class SkillManager {
    constructor() {
        const skillPane = document.getElementById("skill_pane");
        this.abilityList = new Map();
        Object.values(Ability).forEach((value) => {
            const abilityContainer = new AbilityContainer(value);
            this.abilityList.set(value, abilityContainer);
            skillPane.appendChild(abilityContainer.H_container);
        });
        this.skillList = new Map([
            ["sleeping", new Skill("sleeping", this.abilityList.get(Ability.Integrity), 10, 10, 1.5)],
            ["farming", new Skill("farming", this.abilityList.get(Ability.Resistance), 10, 100, 1.5)],
            ["toughness", new Skill("toughness", this.abilityList.get(Ability.Resistance), 10, 100, 1.5)]
        ]);
        // TODO redo when I move skill list off constructor; move attachSkillContainer call back to Skill init
        for (const [key, value] of this.skillList.entries()) {
            this.attachSkillContainer(value);
        }
        // checking if any of the super skills should be made visible
        // ...later, when I add save/load
    }
    gainSkill(id, amount) {
        this.skillList.get(id).addXp(amount);
    }
    attachSkillContainer(skill) {
        this.abilityList.get(skill.ability).H_container.appendChild(skill.H_container);
    }
}
