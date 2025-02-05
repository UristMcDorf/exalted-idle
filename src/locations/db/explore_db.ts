// This is easier to work with than directly in the location DB

import { EnemyDB, EnemyDBEntry } from "../../combat/enemy_db.js";
import { MinMax, Weighted } from "../../utils.js";

interface WaveDBEntry extends Weighted
{
    enemies: EnemyDBEntry[];
}

interface ExploreEventDBEntry
{

}

export interface ExploreAreaDBEntry
{
    wavesBetweenEventsMinMax: MinMax;
    exploreEventsList: Set<ExploreEventDBEntry>;
    enemyWaves: Set<WaveDBEntry>;
}

export const ExploreDB: Map<string, ExploreAreaDBEntry> = new Map<string, ExploreAreaDBEntry>([
    ["rats",
        {
            wavesBetweenEventsMinMax: new MinMax(30, 50),
            exploreEventsList: new Set<ExploreEventDBEntry>([

            ]),
            enemyWaves: new Set<WaveDBEntry>([
                { weight: 5, enemies: [ EnemyDB.get("rat")! ] },
                { weight: 10, enemies: [ EnemyDB.get("rat")!, EnemyDB.get("rat")! ] },
                { weight: 5, enemies: [ EnemyDB.get("rat")!, EnemyDB.get("rat")!, EnemyDB.get("rat")! ] },
                { weight: 2, enemies: [ EnemyDB.get("eliterat")! ] }
            ])
        }
    ]
])