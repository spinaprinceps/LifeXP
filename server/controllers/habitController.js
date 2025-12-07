const pool = require('../config/database');

// Create habit
exports.createHabit = async (req, res) => {
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
};

// Edit habit
exports.editHabit = async (req, res) => {
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
};

// Delete habit
exports.deleteHabit = async (req, res) => {
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
};

// Get all habits for a user
exports.getUserHabits = async (req, res) => {
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
};
