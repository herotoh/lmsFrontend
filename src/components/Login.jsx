import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/userSlice';
import api from '../axiosConfig';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
                  const credentials = { username, password }; // Declare 'credentials'

        // Log the input credentials
        console.log('Login: Attempting login with username:', username, 'password:', password);
      console.log('Login: Sending credentials:', credentials); // Add this line
      console.log('Login: Sending credentials:', JSON.stringify(credentials)); // Use JSON.stringify
        try {
            const response = await api.post('/auth/login', { username, password });
            console.log('Login: Full response:', response); // Log the entire response
            console.log('Login: Response data:', response.data); // Log just the data

            dispatch(loginUser(response.data));
            navigate('/booksAvailable');

        } catch (err) {
            console.error('Login: Login error:', err);
            console.error('Login: Full error object:', err); // Log the entire error
            if (err.response) {
                console.error('Login: Error response status:', err.response.status); // Log status code
                console.error('Login: Error response headers:', err.response.headers); // Log headers
                console.error('Login: Error response data:', err.response.data);   // Log response body
                setError(err.response?.data?.message || 'Login failed');
            } else if (err.request) {
                console.error('Login: No response received. Request was:', err.request);
                setError('No response from server. Please check your connection.');
            } else {
                console.error('Login: Error setting up the request:', err.message);
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
}

export default Login;