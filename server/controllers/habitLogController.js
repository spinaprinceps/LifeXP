const supabase = require('../config/database');
const { xpValues, calculateLevel } = require('../utils/xpSystem');

// Helper to check if all habits are completed
async function checkAllHabitsCompleted(user_id, date) {
    const { data: allHabits } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', user_id)
        .eq('active', true);

    const { data: completedToday } = await supabase
        .from('habit_logs')
        .select('habit_id')
        .eq('user_id', user_id)
        .eq('date', date);

    return allHabits && completedToday && allHabits.length === completedToday.length && allHabits.length > 0;
}

// Helper to update daily stats
async function updateDailyStats(user_id, date, completed_all) {
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Get yesterday's stats
    const { data: yesterdayStats } = await supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', user_id)
        .eq('date', yesterdayStr)
        .single();

    let newStreak = 0;
    if (yesterdayStats && yesterdayStats.completed_all) {
        newStreak = yesterdayStats.streak_count + (completed_all ? 1 : 0);
    } else if (completed_all) {
        newStreak = 1;
    }

    // Upsert today's stats
    const { data: updatedStats } = await supabase
        .from('daily_stats')
        .upsert({
            user_id,
            date,
            completed_all,
            streak_count: newStreak
        }, {
            onConflict: 'user_id,date'
        })
        .select()
        .single();

    return updatedStats ? updatedStats.streak_count : newStreak;
}

// Mark habit as completed
exports.completeHabit = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    try {
        const today = new Date().toISOString().split('T')[0];

        // Check if already completed today
        const { data: existingLog } = await supabase
            .from('habit_logs')
            .select('*')
            .eq('habit_id', id)
            .eq('user_id', user_id)
            .eq('date', today)
            .single();

        if (existingLog) {
            return res.status(400).json({ error: 'Habit already completed today' });
        }

        // Find habit category
        const { data: habit, error: habitError } = await supabase
            .from('habits')
            .select('category')
            .eq('id', id)
            .single();

        if (habitError || !habit) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        const category = habit.category;
        const xpEarned = xpValues[category] || 0;

        // Insert into habit_logs
        const { data: log, error: logError } = await supabase
            .from('habit_logs')
            .insert([{ habit_id: id, user_id, date: today }])
            .select()
            .single();

        if (logError) throw logError;

        // Get current user
        const { data: currentUser } = await supabase
            .from('users')
            .select('xp')
            .eq('id', user_id)
            .single();

        const newXp = (currentUser?.xp || 0) + xpEarned;
        const newLevel = calculateLevel(newXp);

        // Update user XP and level
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({ xp: newXp, level: newLevel })
            .eq('id', user_id)
            .select('id, username, email, xp, level')
            .single();

        if (updateError) throw updateError;

        // Check if all habits completed
        const allCompleted = await checkAllHabitsCompleted(user_id, today);

        // Update daily stats and streak
        const streak = await updateDailyStats(user_id, today, allCompleted);

        res.status(200).json({
            message: 'Habit completed successfully',
            xpEarned,
            level: newLevel,
            streak,
            allCompleted,
            log,
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Mark habit as uncompleted
exports.uncompleteHabit = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    try {
        const today = new Date().toISOString().split('T')[0];

        // Find the log entry for today
        const { data: log } = await supabase
            .from('habit_logs')
            .select('*')
            .eq('habit_id', id)
            .eq('user_id', user_id)
            .eq('date', today)
            .single();

        if (!log) {
            return res.status(404).json({ error: 'No completion record found for today' });
        }

        // Find habit category to deduct XP
        const { data: habit } = await supabase
            .from('habits')
            .select('category')
            .eq('id', id)
            .single();

        if (!habit) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        const category = habit.category;
        const xpToDeduct = xpValues[category] || 0;

        // Delete the log entry
        await supabase
            .from('habit_logs')
            .delete()
            .eq('habit_id', id)
            .eq('user_id', user_id)
            .eq('date', today);

        // Delete the log entry
        await supabase
            .from('habit_logs')
            .delete()
            .eq('habit_id', id)
            .eq('user_id', user_id)
            .eq('date', today);

        // Get current user
        const { data: currentUser } = await supabase
            .from('users')
            .select('xp')
            .eq('id', user_id)
            .single();

        const newXp = Math.max(0, (currentUser?.xp || 0) - xpToDeduct);
        const newLevel = calculateLevel(newXp);

        // Update user XP and level
        const { data: updatedUser } = await supabase
            .from('users')
            .update({ xp: newXp, level: newLevel })
            .eq('id', user_id)
            .select('id, username, email, xp, level')
            .single();

        // Recalculate if all habits are still completed
        const allCompleted = await checkAllHabitsCompleted(user_id, today);

        // Update daily stats
        const streak = await updateDailyStats(user_id, today, allCompleted);

        res.status(200).json({
            message: 'Habit uncompleted successfully',
            xpDeducted: xpToDeduct,
            level: newLevel,
            streak,
            allCompleted,
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get habit logs for a user
exports.getHabitLogs = async (req, res) => {
    const { user_id } = req.params;

    try {
        const { data: logs, error } = await supabase
            .from('habit_logs')
            .select(`
                *,
                habits:habit_id (
                    name,
                    category
                )
            `)
            .eq('user_id', user_id)
            .order('completed_at', { ascending: false });

        if (error) throw error;

        // Flatten the structure for easier consumption
        const formattedLogs = logs.map(log => ({
            ...log,
            habit_name: log.habits?.name,
            category: log.habits?.category
        }));

        res.status(200).json({
            logs: formattedLogs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
