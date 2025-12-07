import axios from 'axios';

const API_URL = 'http://localhost:3000/api/habits';

export const createHabit = async (user_id, name, frequency, category) => {
  const response = await axios.post(`${API_URL}/create`, { user_id, name, frequency, category });
  return response.data;
};

export const editHabit = async (id, name, frequency, category, active) => {
  const response = await axios.put(`${API_URL}/${id}`, { name, frequency, category, active });
  return response.data;
};

export const deleteHabit = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const completeHabit = async (id, user_id) => {
  const response = await axios.post(`${API_URL}/${id}/complete`, { user_id });
  return response.data;
};

export const uncompleteHabit = async (id, user_id) => {
  const response = await axios.post(`${API_URL}/${id}/uncomplete`, { user_id });
  return response.data;
};

export const getUserHabits = async (user_id) => {
  const response = await axios.get(`${API_URL}/user/${user_id}`);
  return response.data;
};

export const getUserLogs = async (user_id) => {
  const response = await axios.get(`${API_URL}/logs/${user_id}`);
  return response.data;
};

export const getUserStats = async (user_id) => {
  const response = await axios.get(`${API_URL}/stats/${user_id}`);
  return response.data;
};
