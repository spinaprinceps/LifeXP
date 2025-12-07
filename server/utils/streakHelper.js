// Check if all today's habits are completed
async function checkAllHabitsCompleted(client, user_id, date) {
    // Get all active habits for user
    const activeHabits = await client.query(
        'SELECT id FROM habits WHERE user_id = $1 AND active = true',
        [user_id]
    );

    if (activeHabits.rows.length === 0) {
        return false;
    }

    // Get today's completed habits
    const completedToday = await client.query(
        'SELECT DISTINCT habit_id FROM habit_logs WHERE user_id = $1 AND date = $2',
        [user_id, date]
    );

    return completedToday.rows.length === activeHabits.rows.length;
}

// Update daily stats and streak
async function updateDailyStats(client, user_id, date, allCompleted) {
    // Check if daily_stats entry exists for today
    const existingStats = await client.query(
        'SELECT * FROM daily_stats WHERE user_id = $1 AND date = $2',
        [user_id, date]
    );

    if (existingStats.rows.length === 0) {
        // Get yesterday's streak
        const yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const yesterdayStats = await client.query(
            'SELECT * FROM daily_stats WHERE user_id = $1 AND date = $2',
            [user_id, yesterdayStr]
        );

        let newStreak = 0;
        if (yesterdayStats.rows.length > 0 && yesterdayStats.rows[0].completed_all) {
            newStreak = yesterdayStats.rows[0].streak_count;
        }

        if (allCompleted) {
            newStreak += 1;
        }

        // Create new daily_stats entry
        await client.query(
            'INSERT INTO daily_stats (user_id, date, completed_all, streak_count) VALUES ($1, $2, $3, $4)',
            [user_id, date, allCompleted, newStreak]
        );

        return newStreak;
    } else {
        // Update existing entry
        let newStreak = existingStats.rows[0].streak_count;

        if (allCompleted && !existingStats.rows[0].completed_all) {
            // Just completed all habits today
            newStreak += 1;
        } else if (!allCompleted && existingStats.rows[0].completed_all) {
            // Uncompleted a habit, lose today's streak increment
            newStreak = Math.max(0, newStreak - 1);
        }

        await client.query(
            'UPDATE daily_stats SET completed_all = $1, streak_count = $2 WHERE user_id = $3 AND date = $4',
            [allCompleted, newStreak, user_id, date]
        );

        return newStreak;
    }
}

module.exports = {
    checkAllHabitsCompleted,
    updateDailyStats
};
