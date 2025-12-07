import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_URL = `${API_BASE}/api/todos`;

// Create a new todo
export const createTodo = async (user_id, title, description, due_date) => {
    const response = await axios.post(API_URL, {
        user_id,
        title,
        description,
        due_date
    });
    return response.data;
};

// Get all todos for a user
export const getUserTodos = async (user_id) => {
    const response = await axios.get(`${API_URL}/user/${user_id}`);
    return response.data;
};

// Update a todo
export const updateTodo = async (id, user_id, title, description, due_date) => {
    const response = await axios.put(`${API_URL}/${id}`, {
        user_id,
        title,
        description,
        due_date
    });
    return response.data;
};

// Toggle todo completion
export const toggleTodoComplete = async (id, user_id) => {
    const response = await axios.patch(`${API_URL}/${id}/complete`, {
        user_id
    });
    return response.data;
};

// Delete a todo
export const deleteTodo = async (id, user_id) => {
    const response = await axios.delete(`${API_URL}/${id}?user_id=${user_id}`);
    return response.data;
};

// Get todo stats
export const getTodoStats = async (user_id) => {
    const response = await axios.get(`${API_URL}/stats/${user_id}`);
    return response.data;
};
