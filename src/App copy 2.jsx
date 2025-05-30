import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import MemberList from './components/MemberList';
import MemberDetails from './components/MemberDetails';
import MemberProfile from './components/MemberProfile';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';

function App() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="App">
      <h1>Library Management System</h1>
      <Router>
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={<MemberListWrapper setSelectedMember={setSelectedMember} />}
          />
          <Route
            path="/member"
            element={
              <MemberDetailsWrapper
                selectedMember={selectedMember}
                setSelectedMember={setSelectedMember}
              />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setSelectedMember={setSelectedMember} />} />
          <Route path="/profile" element={<MemberProfile />} />
          
        </Routes>
      </Router>
    </div>
  );
}

// Navigation bar component
function NavBar() {
  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>Home</Link>
      <Link to="/register" style={linkStyle}>Register</Link>
      <Link to="/login" style={linkStyle}>Login</Link>
      
    </nav>
  );
}

const navStyle = {
  padding: '10px 20px',
  marginBottom: '20px',
  backgroundColor: '#333',
  display: 'flex',
  gap: '15px',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 'bold',
};

function MemberListWrapper({ setSelectedMember }) {
  const navigate = useNavigate();

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    navigate('/member');
  };

  return <MemberList onSelectMember={handleSelectMember} />;
}

function MemberDetailsWrapper({ selectedMember, setSelectedMember }) {
  const navigate = useNavigate();

  const handleBack = () => {
    setSelectedMember(null);
    navigate('/');
  };

  return <MemberDetails member={selectedMember} onBack={handleBack} />;
}

export default App;
