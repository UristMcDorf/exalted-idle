import { S_localisationManager, S_logManager, S_tooltip } from "../main.js";
import { ProgressBar } from "../progress_bar.js";
import { LogCategory } from "../s_log_manager.js";
export class Skill {
    constructor(id, abilityContainer, maxLevel, baseXpPerLevel = 100, xpScaling = 1.5) {
        this.id = id;
        this.abilityContainer = abilityContainer;
        this.abilityContainer.skills.push(this);
        this.ability = abilityContainer.ability;
        this.xp = 0;
        this.currentLevel = 0;
        this.maxLevel = maxLevel;
        this.baseXpPerLevel = baseXpPerLevel;
        this.xpScaling = xpScaling;
        this.makeContainer();
    }
    // returns true if level has changed, can be relevant for updates
    addXp(amount) {
        if (this.currentLevel == this.maxLevel) {
            return false;
        }
        this.xp += amount;
        return this.recalculateLevel();
    }
    // returns true if level has changed, can be relevant for updates
    // TODO: I REALLY need to move stuff like this to events, it's time to learn how :P
    recalculateLevel() {
        if (this.xp < this.xpToNextLevel()) {
            this.progressBar.setValue(this.xp);
            this.updateVisibility();
            return false;
        }
        while (this.xp >= this.xpToNextLevel()) {
            this.xp -= this.xpToNextLevel();
            this.currentLevel++;
            S_logManager.log(S_localisationManager.getString("skill." + this.id) + " reached level " + this.currentLevel + "!", LogCategory.Levels); // TOLOC
            if (this.currentLevel == this.maxLevel) {
                this.progressBar.setValue(this.xpToNextLevel(), this.xpToNextLevel()); // just basically permanently clamping it to 100%, won't be updated anymore
                this.H_labelLevel.innerHTML = this.levelString();
                this.updateVisibility();
                return true;
            }
        }
        this.progressBar.setValue(this.xp, this.xpToNextLevel());
        this.H_labelLevel.innerHTML = this.levelString();
        this.updateVisibility();
        return true;
    }
    shouldBeVisible() {
        return this.currentLevel > 0;
    }
    xpToNextLevel() {
        return Math.floor(this.baseXpPerLevel * Math.pow(this.xpScaling, this.currentLevel));
    }
    levelString() {
        return this.currentLevel + "/" + this.maxLevel;
    }
    makeContainer() {
        let container = document.createElement("div");
        container.id = "skill_container." + this.id;
        container.className = "skill_container";
        // label
        let labelDiv = document.createElement("div");
        let nameSpan = document.createElement("span");
        nameSpan.id = "skill_label.name." + this.id;
        nameSpan.innerHTML = S_localisationManager.getString("skill." + this.id);
        this.H_labelName = nameSpan;
        let levelSpan = document.createElement("span");
        levelSpan.id = "skill_label.level." + this.id;
        levelSpan.className = "skill_label_level";
        levelSpan.innerHTML = this.levelString();
        this.H_labelLevel = levelSpan;
        labelDiv.append(nameSpan, " ", levelSpan);
        // progress bar
        let progressBarDiv = document.createElement("div");
        progressBarDiv.className = "progress_bar_container";
        progressBarDiv.style.height = "4px";
        let progressBarFilledDiv = document.createElement("div");
        progressBarFilledDiv.id = "progress_bar_filled.skill." + this.id;
        progressBarFilledDiv.className = "progress_bar_filled skill_progress_bar_filled_color";
        let progressBarMissingDiv = document.createElement("div");
        progressBarMissingDiv.id = "progress_bar_missing.skill." + this.id;
        progressBarMissingDiv.className = "progress_bar_missing skill_progress_bar_missing_color";
        progressBarDiv.appendChild(progressBarFilledDiv);
        progressBarDiv.appendChild(progressBarMissingDiv);
        container.appendChild(labelDiv);
        container.appendChild(progressBarDiv);
        this.progressBar = new ProgressBar("skill." + this.id, 0, this.baseXpPerLevel, progressBarFilledDiv, progressBarMissingDiv);
        this.H_container = container;
        this.updateVisibility();
        this.H_container.addEventListener("mouseover", evt => S_tooltip.setStringSource(this));
        this.H_container.addEventListener("mouseout", evt => S_tooltip.setVisibility(false)); // TODO: review
    }
    updateStringSource() {
        return Math.floor(this.xp) + "/" + this.xpToNextLevel() + " to level"; // TOLOC
    }
    updateVisibility() {
        this.abilityContainer.updateVisibility();
        this.H_container.style.display = this.shouldBeVisible() && !this.abilityContainer.collapsed ? "block" : "none";
    }
}
