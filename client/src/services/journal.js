import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/journal` : 'http://localhost:3000/api/journal';

// Create a new journal entry
export const createEntry = async (user_id, content) => {
  const response = await axios.post(API_URL, { user_id, content });
  return response.data;
};

// Get all journal entries for a user
export const getUserEntries = async (user_id) => {
  const response = await axios.get(`${API_URL}/user/${user_id}`);
  return response.data;
};

// Get a single journal entry by ID
export const getEntryById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Update a journal entry
export const updateEntry = async (id, content) => {
  const response = await axios.put(`${API_URL}/${id}`, { content });
  return response.data;
};

// Delete a journal entry
export const deleteEntry = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
