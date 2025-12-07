const pool = require('../config/database');
const { levelThresholds, calculateLevel } = require('../utils/xpSystem');

// Get user stats (XP, level, streak)
exports.getUserStats = async (req, res) => {
    const { user_id } = req.params;

    try {
        // Get user info
        const user = await pool.query(
            'SELECT id, name, email, xp, level FROM users WHERE id = $1',
            [user_id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = user.rows[0];
        const currentLevel = calculateLevel(userData.xp);

        // Get today's stats
        const today = new Date().toISOString().split('T')[0];
        const todayStats = await pool.query(
            'SELECT * FROM daily_stats WHERE user_id = $1 AND date = $2',
            [user_id, today]
        );

        let streak = 0;
        let allCompletedToday = false;
        if (todayStats.rows.length > 0) {
            streak = todayStats.rows[0].streak_count;
            allCompletedToday = todayStats.rows[0].completed_all;
        }

        // Get next level XP threshold
        const nextLevelXp = levelThresholds[currentLevel + 1] || levelThresholds[levelThresholds.length - 1];

        res.status(200).json({
            user: userData,
            level: currentLevel,
            xp: userData.xp,
            nextLevelXp,
            streak,
            allCompletedToday
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get monthly stats for calendar
exports.getMonthlyStats = async (req, res) => {
    const { user_id, year, month } = req.params;

    try {
        // Get all daily_stats for the specified month
        const stats = await pool.query(
            `SELECT date, completed_all, streak_count 
             FROM daily_stats 
             WHERE user_id = $1 
             AND EXTRACT(YEAR FROM date) = $2 
             AND EXTRACT(MONTH FROM date) = $3
             ORDER BY date`,
            [user_id, year, month]
        );

        res.status(200).json({
            stats: stats.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
