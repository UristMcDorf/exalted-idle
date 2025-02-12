// obviously many more things later on but for now again
export const DB_Enemy = new Map([
    ["rat", { id: "rat", health: 10, defence: 2, evasion: 0.2, accuracyFactor: 1, powerFactor: 1, attacks: [{ weight: 15, id: "claw" }, { weight: 4, id: "bite" }] }],
    ["eliterat", { id: "eliterat", health: 30, defence: 3, evasion: 0.3, accuracyFactor: 1, powerFactor: 1.5, attacks: [{ weight: 15, id: "claw" }, { weight: 4, id: "bite" }] }]
]);
