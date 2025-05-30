import axios from 'axios';
import store from './store/store'; // Adjust the path if necessary
import { logoutUser } from './store/userSlice'; // ✅ Import logoutUser


const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Your base URL
    withCredentials: true, // Crucial for sending cookies
});

// Request interceptor (for HttpOnly cookies - token is automatically included)
api.interceptors.request.use(
    config => {
        // No need to manually add Authorization header with HttpOnly cookies
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor (for global error handling)
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        // Handle specific error codes here (e.g., 401, 403)
        if (error.response && error.response.status === 401) {
            store.dispatch(logoutUser()); // Clear user state
            // Redirect to login (if not already there)
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'; // Simple redirect
            }
        }
        return Promise.reject(error);
    }
);

export default api;