import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/userSlice'; // ✅ Correct import

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ You had this commented out — it’s needed

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const credentials = btoa(`${username}:${password}`);
      console.log('Fetching member details from /api/me...');

      const response = await axios.get('http://localhost:8080/api/me', {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Login successful!', response.data);

      // ✅ Save user to Redux (pass username and roles from response)
     // dispatch(loginUser({
       // username: username,
        //roles: response.data.roles || [] // fallback to empty array if undefined
      //}));
      dispatch(loginUser(response.data));

      // ✅ Navigate to member dashboard
      navigate('/member');



    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Login faailed: Invalid username or password.');
      } else {
        setError('Login failed. Please check your network or try again.');
        console.error('Login error:', err.response || err);
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
