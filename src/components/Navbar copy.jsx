import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/userSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav style={navStyle}>
      <div>
        <Link to="/booksAvailable" style={linkStyle}>Home</Link>
        {!user && <Link to="/register" style={linkStyle}>Register</Link>}
        {!user && <Link to="/login" style={linkStyle}>Login</Link>}
        {user && <Link to="/addBook" style={linkStyle}>Add Book</Link>}
        <Link to="/booksAvailable" style={linkStyle}>Books Available</Link>
        {user && <Link to="/borrowedBooks" style={linkStyle}>My Borrowed Books</Link>}
      </div>
      <div>
        {user && (
          <>
            <span style={{ marginRight: '10px' }}>Welcome, {user.name}</span>
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

const navStyle = {
  padding: '10px 20px',
  marginBottom: '20px',
  backgroundColor: '#333',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: 'white',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 'bold',
  marginRight: '15px',
};

const buttonStyle = {
  backgroundColor: '#ff4d4d',
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  cursor: 'pointer',
  fontWeight: 'bold',
  borderRadius: '4px',
};

export default Navbar;
