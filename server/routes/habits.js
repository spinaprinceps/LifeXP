const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: 5432,
    ssl: {
        require: true,
    }
});

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

// Create habit
router.post('/create', async (req, res) => {
    const { user_id, name, frequency, category } = req.body;

    try {
        const newHabit = await pool.query(
            'INSERT INTO habits (user_id, name, frequency, category) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, name, frequency, category]
        );

        res.status(201).json({
            message: 'Habit created successfully',
            habit: newHabit.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Edit habit
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, frequency, category, active } = req.body;

    try {
        const updatedHabit = await pool.query(
            'UPDATE habits SET name = $1, frequency = $2, category = $3, active = $4 WHERE id = $5 RETURNING *',
            [name, frequency, category, active, id]
        );

        if (updatedHabit.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        res.status(200).json({
            message: 'Habit updated successfully',
            habit: updatedHabit.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete habit
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedHabit = await pool.query('DELETE FROM habits WHERE id = $1 RETURNING *', [id]);

        if (deletedHabit.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        res.status(200).json({
            message: 'Habit deleted successfully',
            habit: deletedHabit.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Mark habit as completed
router.post('/:id/complete', async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const today = new Date().toISOString().split('T')[0];

        // Check if already completed today
        const existingLog = await client.query(
            'SELECT * FROM habit_logs WHERE habit_id = $1 AND user_id = $2 AND date = $3',
            [id, user_id, today]
        );

        if (existingLog.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Habit already completed today' });
        }

        // Find habit category
        const habit = await client.query('SELECT category FROM habits WHERE id = $1', [id]);

        if (habit.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Habit not found' });
        }

        const category = habit.rows[0].category;
        const xpEarned = xpValues[category] || 0;

        // Insert into habit_logs
        const log = await client.query(
            'INSERT INTO habit_logs (habit_id, user_id, date) VALUES ($1, $2, $3) RETURNING *',
            [id, user_id, today]
        );

        // Update user XP
        const updatedUser = await client.query(
            'UPDATE users SET xp = xp + $1 WHERE id = $2 RETURNING id, name, email, xp',
            [xpEarned, user_id]
        );

        const newXp = updatedUser.rows[0].xp;
        const newLevel = calculateLevel(newXp);

        // Update user level
        await client.query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, user_id]);

        // Check if all habits completed
        const allCompleted = await checkAllHabitsCompleted(client, user_id, today);

        // Update daily stats and streak
        const streak = await updateDailyStats(client, user_id, today, allCompleted);

        await client.query('COMMIT');

        res.status(200).json({
            message: 'Habit completed successfully',
            xpEarned,
            level: newLevel,
            streak,
            allCompleted,
            log: log.rows[0],
            user: { ...updatedUser.rows[0], level: newLevel }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
});

// Mark habit as uncompleted
router.post('/:id/uncomplete', async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const today = new Date().toISOString().split('T')[0];

        // Find the log entry for today
        const log = await client.query(
            'SELECT * FROM habit_logs WHERE habit_id = $1 AND user_id = $2 AND date = $3',
            [id, user_id, today]
        );

        if (log.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'No completion record found for today' });
        }

        // Find habit category to deduct XP
        const habit = await client.query('SELECT category FROM habits WHERE id = $1', [id]);

        if (habit.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Habit not found' });
        }

        const category = habit.rows[0].category;
        const xpToDeduct = xpValues[category] || 0;

        // Delete the log entry
        await client.query(
            'DELETE FROM habit_logs WHERE habit_id = $1 AND user_id = $2 AND date = $3',
            [id, user_id, today]
        );

        // Deduct XP from user
        const updatedUser = await client.query(
            'UPDATE users SET xp = GREATEST(0, xp - $1) WHERE id = $2 RETURNING id, name, email, xp',
            [xpToDeduct, user_id]
        );

        const newXp = updatedUser.rows[0].xp;
        const newLevel = calculateLevel(newXp);

        // Update user level
        await client.query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, user_id]);

        // Recalculate if all habits are still completed
        const allCompleted = await checkAllHabitsCompleted(client, user_id, today);

        // Update daily stats
        const streak = await updateDailyStats(client, user_id, today, allCompleted);

        await client.query('COMMIT');

        res.status(200).json({
            message: 'Habit uncompleted successfully',
            xpDeducted: xpToDeduct,
            level: newLevel,
            streak,
            allCompleted,
            user: { ...updatedUser.rows[0], level: newLevel }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
});

// Get all habits for a user
router.get('/user/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const habits = await pool.query(
            'SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC',
            [user_id]
        );

        res.status(200).json({
            habits: habits.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get habit logs for a user
router.get('/logs/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const logs = await pool.query(
            `SELECT hl.*, h.name as habit_name, h.category 
             FROM habit_logs hl 
             JOIN habits h ON hl.habit_id = h.id 
             WHERE hl.user_id = $1 
             ORDER BY hl.completed_at DESC`,
            [user_id]
        );

        res.status(200).json({
            logs: logs.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user stats (XP, level, streak)
router.get('/stats/:user_id', async (req, res) => {
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
});

// Get monthly stats for calendar
router.get('/monthly-stats/:user_id/:year/:month', async (req, res) => {
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
});

module.exports = router;
