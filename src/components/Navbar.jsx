import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/userSlice';
import './Navbar.css'; // Create Navbar.css for styling

const Navbar = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login'); // Redirect to login after logout
    };

    const isAuthenticated = !!user.username; // Check for username (more reliable)

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/" className="navbar-link">Home</Link>
                {!isAuthenticated && <Link to="/register" className="navbar-link">Register</Link>}
                {!isAuthenticated && <Link to="/login" className="navbar-link">Login</Link>}
                {isAuthenticated && <Link to="/addBook" className="navbar-link">Add Book</Link>}
                <Link to="/booksAvailable" className="navbar-link">Books Available</Link>
                {isAuthenticated && <Link to="/borrowedBooks" className="navbar-link">My Borrowed Books</Link>}
                {isAuthenticated && <Link to="/profile" className="navbar-link">My Profile</Link>}
            </div>
            {isAuthenticated && (
                <div className="navbar-auth">
                    <span className="navbar-welcome">Welcome, {user.username}</span>
                    <button onClick={handleLogout} className="navbar-button">Logout</button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;