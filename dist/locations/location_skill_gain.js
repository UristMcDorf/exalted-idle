import { Location } from "./location.js";
import { S_statManager } from "../main.js";
export class LocationSkillGain extends Location {
    constructor(name, actions, skillid, skillgain) {
        super(name, actions);
        this.skillid = skillid;
        this.skillgain = skillgain;
    }
    update() {
        S_statManager.gainSkill(this.skillid, this.skillgain);
        super.update();
    }
}
