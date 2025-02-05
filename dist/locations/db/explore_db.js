// This is easier to work with than directly in the location DB
import { EnemyDB } from "../../combat/enemy_db.js";
import { MinMax } from "../../utils.js";
export const ExploreDB = new Map([
    ["rats",
        {
            wavesBetweenEventsMinMax: new MinMax(30, 50),
            exploreEventsList: new Set([]),
            enemyWaves: new Set([
                { weight: 5, enemies: [EnemyDB.get("rat")] },
                { weight: 10, enemies: [EnemyDB.get("rat"), EnemyDB.get("rat")] },
                { weight: 5, enemies: [EnemyDB.get("rat"), EnemyDB.get("rat"), EnemyDB.get("rat")] },
                { weight: 2, enemies: [EnemyDB.get("eliterat")] }
            ])
        }
    ]
]);
