import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MemberList from './components/MemberList';
import MemberDetails from './components/MemberDetails';
import MemberProfile from './components/MemberProfile';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import BooksAvailable from './components/BooksAvailable';
import BorrowedBooks from './components/BorrowedBooks';
import AddBook from './components/AddBook';
import NotFound from './components/NotFound'; // Import NotFound
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import './App.css';

function App() {
    return (
        <div className="App">
            <h1>Library Management System</h1>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/member" element={<PrivateRoute><MemberDetails /></PrivateRoute>} />
                    <Route path="/profile" element={<MemberProfile />} />
                    <Route path="/booksAvailable" element={<PrivateRoute><BooksAvailable /></PrivateRoute>} />
                    <Route path="/borrowedBooks" element={<PrivateRoute><BorrowedBooks /></PrivateRoute>} />
                    <Route path="/addBook" element={<PrivateRoute><AddBook /></PrivateRoute>} />
                    <Route path="*" element={<NotFound />} /> {/* Add NotFound route */}
                </Routes>
            </Router>
        </div>
    );
}
//<Route path="/profile" element={<PrivateRoute><MemberProfile /></PrivateRoute>} />

const Home = () => {
  return (
    <div>
      <h2>Welcome to the Library Management System!</h2>
      {/* You can add more content here for the home page */}
    </div>
  );
};

export default App;