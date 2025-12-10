const supabase = require('../config/database');

// Create habit
exports.createHabit = async (req, res) => {
    const { user_id, name, frequency, category } = req.body;

    try {
        const { data: newHabit, error } = await supabase
            .from('habits')
            .insert([{ user_id, name, frequency, category }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            message: 'Habit created successfully',
            habit: newHabit
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Edit habit
exports.editHabit = async (req, res) => {
    const { id } = req.params;
    const { name, frequency, category, active } = req.body;

    try {
        const { data: updatedHabit, error } = await supabase
            .from('habits')
            .update({ name, frequency, category, active })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        if (!updatedHabit) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        res.status(200).json({
            message: 'Habit updated successfully',
            habit: updatedHabit
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete habit
exports.deleteHabit = async (req, res) => {
    const { id } = req.params;

    try {
        const { data: deletedHabit, error } = await supabase
            .from('habits')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        if (!deletedHabit) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        res.status(200).json({
            message: 'Habit deleted successfully',
            habit: deletedHabit
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all habits for a user
exports.getUserHabits = async (req, res) => {
    const { user_id } = req.params;

    try {
        const { data: habits, error } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json({
            habits: habits || []
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
