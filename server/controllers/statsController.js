const supabase = require('../config/database');
const { levelThresholds, calculateLevel } = require('../utils/xpSystem');

// Get user stats (XP, level, streak)
exports.getUserStats = async (req, res) => {
    const { user_id } = req.params;

    try {
        // Get user info
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, username, email, xp, level')
            .eq('id', user_id)
            .single();

        if (userError || !userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        const currentLevel = calculateLevel(userData.xp);

        // Get today's stats
        const today = new Date().toISOString().split('T')[0];
        const { data: todayStats } = await supabase
            .from('daily_stats')
            .select('*')
            .eq('user_id', user_id)
            .eq('date', today)
            .single();

        let streak = 0;
        let allCompletedToday = false;
        if (todayStats) {
            streak = todayStats.streak_count;
            allCompletedToday = todayStats.completed_all;
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
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

        const { data: stats, error } = await supabase
            .from('daily_stats')
            .select('date, completed_all, streak_count')
            .eq('user_id', user_id)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date');

        if (error) throw error;

        res.status(200).json({
            stats: stats || []
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
