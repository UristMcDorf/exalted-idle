import { ActionType } from "../../actions/actions.js";
import { ResourceType } from "../../s_character_state_manager.js";
import { LocationEffectType } from "../location_effects/location_effects.js";
import { DB_ExploreArea } from "./explore_area_db.js";
// TODO: probably possible to write validators for this
// WILL BE REPLACED with proper locations before release; think of this as debug town
export const DB_Location = new Set([
    {
        id: "error",
        actionList: new Set([
            { type: ActionType.Move, moveFrom: "error", moveWhere: "home" }
        ]),
        locationEffectList: new Set([])
    },
    {
        id: "home",
        actionList: new Set([
            { type: ActionType.Move, moveFrom: "home", moveWhere: "sleep" },
            { type: ActionType.Move, moveFrom: "home", moveWhere: "field" }
        ]),
        locationEffectList: new Set([])
    },
    {
        id: "sleep",
        actionList: new Set([
            { type: ActionType.Move, moveFrom: "sleep", moveWhere: "home" }
        ]),
        locationEffectList: new Set([
            // funnily enough there's probably going to be a separate Bed type or something instead tho
            { visible: false, type: LocationEffectType.SkillGain, skillGainId: "sleeping", skillGainAmount: 1 },
            { visible: false, type: LocationEffectType.TimeMultiplier, timeMultiplier: 5 },
            { visible: false, type: LocationEffectType.AdjustResourcesMulti, adjustResourcesMultiList: new Map([[ResourceType.Health, { multiplier: 2 }], [ResourceType.Vigour, { multiplier: 4 }]]) }
        ])
    },
    {
        id: "field",
        actionList: new Set([
            { type: ActionType.Move, moveFrom: "field", moveWhere: "gentle_farm" },
            { type: ActionType.Move, moveFrom: "field", moveWhere: "intense_farm" },
            { type: ActionType.Move, moveFrom: "field", moveWhere: "home" },
            { type: ActionType.Move, moveFrom: "field", moveWhere: "rats" },
        ]),
        locationEffectList: new Set([])
    },
    {
        id: "gentle_farm",
        actionList: new Set([
            { type: ActionType.Move, moveFrom: "farm", moveWhere: "field" }
        ]),
        locationEffectList: new Set([
            { visible: true, type: LocationEffectType.SkillGain, skillGainId: "farming", skillGainAmount: 1 }
        ])
    },
    {
        id: "intense_farm",
        actionList: new Set([
            { type: ActionType.Move, moveFrom: "farm", moveWhere: "field" }
        ]),
        locationEffectList: new Set([
            { visible: true, type: LocationEffectType.AdjustResourcesFlat, adjustResourcesFlatList: new Map([[ResourceType.Health, -1], [ResourceType.Vigour, -4]]) },
            { visible: true, type: LocationEffectType.SkillGain, skillGainId: "farming", skillGainAmount: 5 }
        ])
    },
    {
        id: "rats",
        actionList: new Set([
            { type: ActionType.Move, moveFrom: "rats", moveWhere: "field" }
        ]),
        locationEffectList: new Set([
            { visible: true, type: LocationEffectType.Explore, exploreArea: DB_ExploreArea.get("rats") }
        ])
    }
]);
