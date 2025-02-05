import { ActionType } from "../../actions/actions.js";
import { ResourceRegenMultiplier, ResourceType } from "../../s_character_state_manager.js";
import { LocationEffectType } from "../location_effects/location_effects.js";
import { ExploreAreaDBEntry } from "./explore_db.js";

export interface LocationDBEntry
{
    id: string;
    actionList: Set<ActionDBEntry>;
    locationEffectList: Set<LocationEffectDBEntry>;
}

export interface ActionDBEntry
{
    type: ActionType;

    moveFrom?: string;
    moveWhere?: string;
}

export interface LocationEffectDBEntry
{
    type: LocationEffectType;

    visible: boolean;

    //LocationEffectType.SkillGain
    skillGainId?: string;
    skillGainAmount?: number;

    //LocationEffectType.TimeMultiplier
    timeMultiplier?: number;

    //LocationEffectType.AdjustResourcesFlat
    adjustResourcesFlatList?: Map<ResourceType, number>;

    //LocationEffectType.AdjustResourcesMulti
    adjustResourcesMultiList?: Map<ResourceType, ResourceRegenMultiplier>;

    //LocationEffectType.Explore
    exploreArea?: ExploreAreaDBEntry;
}