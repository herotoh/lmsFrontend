import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const fetchMembers = () => axios.get(`${API_BASE_URL}/members`);
