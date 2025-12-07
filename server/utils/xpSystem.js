const xpValues = {
    easy: 10,
    medium: 20,
    hard: 30
};

// Level thresholds (15 levels up to 1.5M XP)
const levelThresholds = [
    0,        // Level 0
    100,      // Level 1
    300,      // Level 2
    800,      // Level 3
    1500,     // Level 4
    3000,     // Level 5
    5500,     // Level 6
    10000,    // Level 7
    20000,    // Level 8
    40000,    // Level 9
    80000,    // Level 10
    150000,   // Level 11
    300000,   // Level 12
    600000,   // Level 13
    1000000,  // Level 14
    1500000   // Level 15
];

function calculateLevel(xp) {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
        if (xp >= levelThresholds[i]) {
            return i;
        }
    }
    return 0;
}

module.exports = {
    xpValues,
    levelThresholds,
    calculateLevel
};
