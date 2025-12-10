const supabase = require('../config/database');

// Create a new todo
exports.createTodo = async (req, res) => {
    const { user_id, title, description, due_date } = req.body;

    try {
        // Validate required fields
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const { data: newTodo, error } = await supabase
            .from('todos')
            .insert([{
                user_id,
                title,
                description: description || null,
                due_date: due_date || null
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            message: 'Todo created successfully',
            todo: newTodo
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
        const { data: todos, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', user_id)
            .order('is_completed', { ascending: true })
            .order('due_date', { ascending: true, nullsFirst: false })
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Add is_overdue flag
        const today = new Date().toISOString().split('T')[0];
        const todosWithOverdue = (todos || []).map(todo => ({
            ...todo,
            is_overdue: todo.due_date && todo.due_date < today && !todo.is_completed
        }));

        res.status(200).json({
            todos: todosWithOverdue
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
        const { data: existingTodo } = await supabase
            .from('todos')
            .select('*')
            .eq('id', id)
            .eq('user_id', user_id)
            .single();

        if (!existingTodo) {
            return res.status(404).json({ error: 'Todo not found or unauthorized' });
        }

        // Update todo
        const { data: updatedTodo, error } = await supabase
            .from('todos')
            .update({
                title,
                description,
                due_date,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', user_id)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({
            message: 'Todo updated successfully',
            todo: updatedTodo
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
        const { data: existingTodo } = await supabase
            .from('todos')
            .select('*')
            .eq('id', id)
            .eq('user_id', user_id)
            .single();

        if (!existingTodo) {
            return res.status(404).json({ error: 'Todo not found or unauthorized' });
        }

        // Toggle completion status
        const { data: updatedTodo, error } = await supabase
            .from('todos')
            .update({
                is_completed: !existingTodo.is_completed,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', user_id)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({
            message: 'Todo completion status updated',
            todo: updatedTodo
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
        const { data: deletedTodo, error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id)
            .eq('user_id', user_id)
            .select()
            .single();

        if (error || !deletedTodo) {
            return res.status(404).json({ error: 'Todo not found or unauthorized' });
        }

        res.status(200).json({
            message: 'Todo deleted successfully',
            todo: deletedTodo
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
        const { data: allTodos, error } = await supabase
            .from('todos')
            .select('is_completed, due_date')
            .eq('user_id', user_id);

        if (error) throw error;

        const today = new Date().toISOString().split('T')[0];
        const stats = {
            total: allTodos.length,
            completed: allTodos.filter(t => t.is_completed).length,
            pending: allTodos.filter(t => !t.is_completed).length,
            overdue: allTodos.filter(t => !t.is_completed && t.due_date && t.due_date < today).length
        };

        res.status(200).json({ stats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
