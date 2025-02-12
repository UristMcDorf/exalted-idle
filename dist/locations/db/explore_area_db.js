// This is easier to work with than directly in the location DB
import { DB_Enemy } from "../../combat/enemy_db.js";
import { MinMax } from "../../utils.js";
export const DB_ExploreArea = new Map([
    ["rats",
        {
            wavesBetweenEventsMinMax: new MinMax(30, 50),
            exploreEventsList: new Set([]),
            enemyWaves: new Set([
                { weight: 5, enemies: [DB_Enemy.get("rat")] },
                { weight: 10, enemies: [DB_Enemy.get("rat"), DB_Enemy.get("rat")] },
                { weight: 5, enemies: [DB_Enemy.get("rat"), DB_Enemy.get("rat"), DB_Enemy.get("rat")] },
                { weight: 2, enemies: [DB_Enemy.get("eliterat")] }
            ])
        }
    ]
]);
