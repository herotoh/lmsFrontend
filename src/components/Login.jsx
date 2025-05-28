import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Keep axios, it's great for making HTTP requests

function Login({ setSelectedMember }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      // 1. Encode username and password for HTTP Basic Authentication
      // btoa() creates a Base64 encoded string from a string.
      const credentials = btoa(`${username}:${password}`);

      // 2. Make a request to a PROTECTED backend endpoint.
      // With HTTP Basic, there's no special "/api/login" endpoint for receiving a JSON body.
      // Instead, you send the Authorization header with credentials to any endpoint
      // that requires authentication. A common approach is to hit a simple
      // "/api/user" or "/api/me" endpoint that returns the logged-in user's details.
      // If such an endpoint doesn't exist, you could even just hit a generic protected endpoint like /api/members (if it's configured to require auth).

      const response = await axios.get('http://localhost:8080/api/members', { // Example: accessing a protected endpoint
        headers: {
          'Authorization': `Basic ${credentials}`, // <--- THIS IS THE KEY CHANGE!
          'Content-Type': 'application/json' // Still good practice to send this
        },
      });

      // Assuming the request to the protected endpoint was successful,
      // you are now authenticated. The response might contain data about the logged-in user/member.
      // You should adjust `response.data` based on what your `/api/members` or similar endpoint returns.
      // For example, if it returns a list of members, you'd need to extract the current user's member info.
      // A more robust backend for login would ideally have an endpoint that just returns the authenticated user's details.

      // For simplicity, let's assume successful authentication means we can proceed.
      // In a real app, you'd process `response.data` to get the logged-in user's info.
      console.log('Login successful!', response.data);
      setSelectedMember(response.data); // Adjust this based on what your backend returns.
                                        // If `api/members` returns a list, this will be wrong.
                                        // If `api/me` or similar returns single member, this is good.
      navigate('/member'); // Navigate to the dashboard or protected area

    } catch (err) {
      // Axios wraps the error, so `err.response` holds details for HTTP errors (4xx, 5xx)
      if (err.response && err.response.status === 401) {
        setError('Login failed: Invalid username or password.');
      } else {
        setError('Login failed. Please check your network or try again.');
        console.error('Login error:', err.response || err);
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;