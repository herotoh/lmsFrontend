import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MemberList from './components/MemberList';
import MemberDetails from './components/MemberDetails';
import MemberProfile from './components/MemberProfile';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import BooksAvailable from './components/BooksAvailable';
import BorrowedBooks from './components/BorrowedBooks';
import AddBook from './components/AddBook';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Library Management System</h1>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MemberList />} />
          <Route path="/member" element={<MemberDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<MemberProfile />} />
        <Route path="/booksAvailable" element={<BooksAvailable />} />
        <Route path="/borrowedBooks" element={<BorrowedBooks />} />          
        <Route path="/addBook" element={<AddBook />} />
        </Routes>
      </Router>
    </div>
  );
}

/*function NavBar() {
  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>Home</Link>
      <Link to="/register" style={linkStyle}>Register</Link>
      <Link to="/login" style={linkStyle}>Login</Link>
    </nav>
  );
}
*/


export default App;
