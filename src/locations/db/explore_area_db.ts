// This is easier to work with than directly in the location DB

import { DB_Enemy, EnemyDBEntry } from "../../combat/enemy_db.js";
import { EventDBEntry } from "../../events/db/event_db.js";
import { MinMax, Weighted } from "../../utils.js";

interface WaveDBEntry extends Weighted
{
    enemies: EnemyDBEntry[];
}

export interface ExploreAreaDBEntry
{
    wavesBetweenEventsMinMax: MinMax;
    exploreEventsList: Set<EventDBEntry>;
    enemyWaves: Set<WaveDBEntry>;
}

export const DB_ExploreArea: Map<string, ExploreAreaDBEntry> = new Map<string, ExploreAreaDBEntry>([
    ["rats",
        {
            wavesBetweenEventsMinMax: new MinMax(30, 50),
            exploreEventsList: new Set<EventDBEntry>([

            ]),
            enemyWaves: new Set<WaveDBEntry>([
                { weight: 5, enemies: [ DB_Enemy.get("rat")! ] },
                { weight: 10, enemies: [ DB_Enemy.get("rat")!, DB_Enemy.get("rat")! ] },
                { weight: 5, enemies: [ DB_Enemy.get("rat")!, DB_Enemy.get("rat")!, DB_Enemy.get("rat")! ] },
                { weight: 2, enemies: [ DB_Enemy.get("eliterat")! ] }
            ])
        }
    ]
])