const pool = require('../config/database');

// Create a new todo
exports.createTodo = async (req, res) => {
    const { user_id, title, description, due_date } = req.body;

    try {
        // Validate required fields
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const newTodo = await pool.query(
            `INSERT INTO todos (user_id, title, description, due_date) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [user_id, title, description || null, due_date || null]
        );

        res.status(201).json({
            message: 'Todo created successfully',
            todo: newTodo.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all todos for a user with auto-overdue detection
exports.getUserTodos = async (req, res) => {
    const { user_id } = req.params;

    try {
        const todos = await pool.query(
            `SELECT *,
                CASE WHEN due_date < CURRENT_DATE AND is_completed = FALSE 
                     THEN TRUE 
                     ELSE FALSE 
                END AS is_overdue
             FROM todos
             WHERE user_id = $1
             ORDER BY is_completed ASC, due_date ASC NULLS LAST, created_at DESC`,
            [user_id]
        );

        res.status(200).json({
            todos: todos.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a todo (title, description, due_date)
exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const { user_id, title, description, due_date } = req.body;

    try {
        // Check if todo exists and belongs to user
        const existingTodo = await pool.query(
            'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
            [id, user_id]
        );

        if (existingTodo.rows.length === 0) {
            return res.status(404).json({ error: 'Todo not found or unauthorized' });
        }

        // Update todo
        const updatedTodo = await pool.query(
            `UPDATE todos 
             SET title = $1, 
                 description = $2, 
                 due_date = $3,
                 updated_at = NOW()
             WHERE id = $4 AND user_id = $5
             RETURNING *`,
            [title, description, due_date, id, user_id]
        );

        res.status(200).json({
            message: 'Todo updated successfully',
            todo: updatedTodo.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Toggle todo completion status
exports.toggleTodoComplete = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    try {
        // Check if todo exists and belongs to user
        const existingTodo = await pool.query(
            'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
            [id, user_id]
        );

        if (existingTodo.rows.length === 0) {
            return res.status(404).json({ error: 'Todo not found or unauthorized' });
        }

        // Toggle completion status
        const updatedTodo = await pool.query(
            `UPDATE todos 
             SET is_completed = NOT is_completed,
                 updated_at = NOW()
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [id, user_id]
        );

        res.status(200).json({
            message: 'Todo completion status updated',
            todo: updatedTodo.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.query;

    try {
        // Check if todo exists and belongs to user
        const deletedTodo = await pool.query(
            'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, user_id]
        );

        if (deletedTodo.rows.length === 0) {
            return res.status(404).json({ error: 'Todo not found or unauthorized' });
        }

        res.status(200).json({
            message: 'Todo deleted successfully',
            todo: deletedTodo.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get todos statistics
exports.getTodoStats = async (req, res) => {
    const { user_id } = req.params;

    try {
        const stats = await pool.query(
            `SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE is_completed = TRUE) as completed,
                COUNT(*) FILTER (WHERE is_completed = FALSE) as pending,
                COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND is_completed = FALSE) as overdue
             FROM todos
             WHERE user_id = $1`,
            [user_id]
        );

        res.status(200).json({
            stats: stats.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
