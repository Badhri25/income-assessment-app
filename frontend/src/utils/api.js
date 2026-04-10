import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api'
});

export const getCases = (params) => API.get('/cases', { params });
export const getCase = (id) => API.get(`/cases/${id}`);
export const createCase = (data) => API.post('/cases', data);
export const updateCase = (id, data) => API.put(`/cases/${id}`, data);
export const deleteCase = (id) => API.delete(`/cases/${id}`);