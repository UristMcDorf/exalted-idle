import { S_localisationManager, S_logManager, S_statManager, S_tooltip } from "../main.js";
import { ProgressBar } from "../progress_bar.js";
import { LogCategory } from "../s_log_manager.js";
import { IStringUpdate } from "../s_tooltip.js";
import { Ability, AbilityContainer } from "./abilities.js";


export class Skill implements IStringUpdate
{
    // will be initialised but doesn't understand that
    progressBar!: ProgressBar;
    H_container!: HTMLDivElement;
    H_labelName!: HTMLSpanElement;
    H_labelLevel!: HTMLSpanElement;

    ability: Ability;
    abilityContainer: AbilityContainer;
    id: string;
    
    lifetimeXp: number; // used for recalculation in case values change for the skill between updates
    xp: number;
    baseXpPerLevel: number;
    xpScaling: number;

    currentLevel: number;
    maxLevel: number;

    constructor(id: string, abilityContainer: AbilityContainer, maxLevel: number, baseXpPerLevel: number = 100, xpScaling: number = 1.5)
    {
        this.id = id;
        this.abilityContainer = abilityContainer;
        this.abilityContainer.skills.add(this);
        this.ability = abilityContainer.ability;

        this.lifetimeXp = 0;
        this.xp = 0;
        this.currentLevel = 0;

        this.maxLevel = maxLevel;
        this.baseXpPerLevel = baseXpPerLevel;
        this.xpScaling = xpScaling;
        
        this.H_container = this.makeContainer();

        this.H_container.addEventListener("mouseover", evt => S_tooltip.setStringSource(this));
        this.H_container.addEventListener("mouseout", evt => S_tooltip.setVisibility(false)); // TODO: review

        this.updateVisibility();
    }

    // returns true if level has changed, can be relevant for updates
    addXp(amount: number): boolean
    {
        this.lifetimeXp += amount;

        if(this.currentLevel == this.maxLevel)
        {
            return false;
        }

        this.xp += amount;

        return this.recalculateLevel();
    }

    // returns true if level has changed, can be relevant for updates
    // TODO: I REALLY need to move stuff like this to events, it's time to learn how :P
    // the loading thing is used to supress logging and to start from zero
    recalculateLevel(loading: boolean = false): boolean
    {
        if(loading)
        {
            this.currentLevel = 0;
            this.xp = this.lifetimeXp;
        }

        if(this.xp < this.xpToNextLevel())
        {
            this.progressBar.setValue(this.xp);

            this.updateVisibility();

            return false;
        }

        while(this.xp >= this.xpToNextLevel())
        {
            this.xp -= this.xpToNextLevel();

            this.currentLevel++;

            if(!loading) S_logManager.log(S_localisationManager.getString(`skill.${this.id}.name`) + " reached level " + this.currentLevel + "!", LogCategory.Levels); // TOLOC

            if(this.currentLevel == this.maxLevel)
            {
                this.progressBar.setValue(this.xpToNextLevel(), this.xpToNextLevel()); // just basically permanently clamping it to 100%, won't be updated anymore

                break;
            }

            this.progressBar.setValue(this.xp, this.xpToNextLevel());
        }

        this.H_labelLevel.innerHTML = this.levelString();

        this.updateVisibility();

        return true;
    }

    shouldBeVisible(): boolean
    {
        return this.currentLevel > 0;
    }

    xpToNextLevel(): number
    {
        return Math.floor(this.baseXpPerLevel * Math.pow(this.xpScaling, this.currentLevel));
    }

    levelString(): string
    {
        return this.currentLevel + "/" + this.maxLevel;
    }

    makeContainer(): HTMLDivElement
    {
        const container: HTMLDivElement = document.createElement("div");

        container.id = `skill_container.${this.id}`;
        container.className = `skill_container`;

        // label
        const labelDiv: HTMLDivElement = document.createElement("div");

        const nameSpan: HTMLSpanElement = document.createElement("span");
        nameSpan.id = `skill_label.name.${this.id}`;
        nameSpan.innerHTML = S_localisationManager.getString(`skill.${this.id}.name`);
        this.H_labelName = nameSpan;

        const levelSpan: HTMLSpanElement = document.createElement("span");
        levelSpan.id = `skill_label.level.${this.id}`;
        levelSpan.className = `skill_label_level`;
        levelSpan.innerHTML = this.levelString();
        this.H_labelLevel = levelSpan;

        labelDiv.append(nameSpan, " ", levelSpan);

        // progress bar
        const progressBarDiv: HTMLDivElement = document.createElement("div");
        
        progressBarDiv.className = `progress_bar_container`;
        progressBarDiv.style.height = `4px`;

        const progressBarFilledDiv: HTMLDivElement = document.createElement("div");
        progressBarFilledDiv.id = `progress_bar_filled.skill.${this.id}`;
        progressBarFilledDiv.className = `progress_bar_filled skill_progress_bar_filled_color`;

        const progressBarMissingDiv: HTMLDivElement = document.createElement("div");
        progressBarMissingDiv.id = `progress_bar_missing.skill.${this.id}`;
        progressBarMissingDiv.className = `progress_bar_missing skill_progress_bar_missing_color`;

        progressBarDiv.appendChild(progressBarFilledDiv);
        progressBarDiv.appendChild(progressBarMissingDiv);

        container.appendChild(labelDiv);
        container.appendChild(progressBarDiv);

        this.progressBar = new ProgressBar(`skill.name.${this.id}`, 0, this.baseXpPerLevel, progressBarFilledDiv, progressBarMissingDiv);

        return container;
    }

    updateStringSource(): string
    {
        return this.currentLevel == this.maxLevel ? `Max level (${this.lifetimeXp} lifetime xp)` : Math.floor(this.xp) + "/" + this.xpToNextLevel() + " to level"; // TOLOC
    }

    updateVisibility(): void
    {
        this.abilityContainer.updateVisibility();
        this.H_container.style.display = this.shouldBeVisible() && !this.abilityContainer.collapsed ? "block" : "none";
    }

    // For saving
    
    import(value: number)
    {
        this.lifetimeXp = value;

        this.recalculateLevel(true);
    }
}