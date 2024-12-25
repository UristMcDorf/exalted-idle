import { ActionType } from "../../actions/actions.js";
import { ResourceType } from "../../s_character_state_manager.js";
import { LocationEffectType } from "../location_effects/location_effects.js";
import { ActionDBEntry, LocationDBEntry, LocationEffectDBEntry } from "./location_db_interfaces.js";

// TODO: probably possible to write validators for this

export const DB_Location: Set<LocationDBEntry> = new Set<LocationDBEntry>([
    { 
        id: "error",
        actionList: new Set<ActionDBEntry>([
            { type: ActionType.Move, moveFrom: "error", moveWhere: "home" }
        ]),
        locationEffectList: new Set<LocationEffectDBEntry>([])
    },
    {
        id: "home",
        actionList: new Set<ActionDBEntry>([
            { type: ActionType.Move, moveFrom: "home", moveWhere: "sleep" },
            { type: ActionType.Move, moveFrom: "home", moveWhere: "field" }
        ]),
        locationEffectList: new Set<LocationEffectDBEntry>([])
    },
    {
        id: "sleep",
        actionList: new Set<ActionDBEntry>([
            { type: ActionType.Move, moveFrom: "sleep", moveWhere: "home" }
        ]),
        locationEffectList: new Set<LocationEffectDBEntry>([
            // funnily enough there's probably going to be a separate Bed type or something instead tho
            { visible: false, type: LocationEffectType.SkillGain, skillGainId: "sleeping", skillGainAmount: 1 },
            { visible: false, type: LocationEffectType.TimeMultiplier, timeMultiplier: 5 },
            { visible: false, type: LocationEffectType.AdjustResourcesMulti, adjustResourcesMultiList: new Map([[ResourceType.Health, { multiplier: 2}],[ResourceType.Vigour, { multiplier: 4 }]]) }
        ])
    },
    {
        id: "field",
        actionList: new Set<ActionDBEntry>([
            { type: ActionType.Move, moveFrom: "field", moveWhere: "gentle_farm" },
            { type: ActionType.Move, moveFrom: "field", moveWhere: "intense_farm" },
            { type: ActionType.Move, moveFrom: "field", moveWhere: "home" }
        ]),
        locationEffectList: new Set<LocationEffectDBEntry>([])
    },
    {
        id: "gentle_farm",
        actionList: new Set<ActionDBEntry>([
            { type: ActionType.Move, moveFrom: "farm", moveWhere: "field" }
        ]),
        locationEffectList: new Set<LocationEffectDBEntry>([
            { visible: true, type: LocationEffectType.SkillGain, skillGainId: "farming", skillGainAmount: 1 }
        ])
    },
    {
        id: "intense_farm",
        actionList: new Set<ActionDBEntry>([
            { type: ActionType.Move, moveFrom: "farm", moveWhere: "field" }
        ]),
        locationEffectList: new Set<LocationEffectDBEntry>([
            { visible: true, type: LocationEffectType.AdjustResourcesFlat, adjustResourcesFlatList: new Map([[ResourceType.Health, -1], [ResourceType.Vigour, -4]]) },
            { visible: true, type: LocationEffectType.SkillGain, skillGainId: "farming", skillGainAmount: 5 }
        ])
    }
])