const pool = require('../config/database');
const { xpValues, calculateLevel } = require('../utils/xpSystem');
const { checkAllHabitsCompleted, updateDailyStats } = require('../utils/streakHelper');

// Mark habit as completed
exports.completeHabit = async (req, res) => {
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
};

// Mark habit as uncompleted
exports.uncompleteHabit = async (req, res) => {
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
};

// Get habit logs for a user
exports.getHabitLogs = async (req, res) => {
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
};
