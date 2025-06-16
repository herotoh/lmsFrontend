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
        e.preventDefault(); // Prevent form reload
        setError(null);

        try {
            console.log('Login: Attempting login with username:', username);

            // 1. Send login request to backend
            const loginResponse = await api.post('/auth/login', { username, password });
            const loginData = loginResponse.data; // Contains token, username, roles

            console.log('Login successful. Received login data:', loginData);

            // 2. Fetch full member details using the username (assumed to be member ID)
            //const memberId = loginData.username; // Backend uses username as memberId
            const memberId = loginData.memberId; // Backend uses username as memberId
            const memberResponse = await api.get(`/members/${memberId}`);
            const memberData = memberResponse.data;

            console.log('Fetched member info from backend:', memberData);

            // 3. Combine login data with full member details
            const fullUserData = {
                token: loginData.token,
                username: loginData.username,
                roles: loginData.roles,
                member: memberData, // now user.member.id will exist
            };

            // 4. Save user in Redux
            dispatch(loginUser(fullUserData));

            // 5. Redirect to booksAvailable page
            //navigate('/booksAvailable');
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);

            if (err.response) {
                console.error('Error response:', err.response);
                setError(err.response?.data?.message || 'Login failed');
            } else if (err.request) {
                console.error('No response from server:', err.request);
                setError('No response from server. Please check your connection.');
            } else {
                console.error('Error setting up request:', err.message);
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
