import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MemberList from './components/MemberList';
import MemberDetails from './components/MemberDetails';
import Register from './components/Register';
import './App.css';

function AppWrapper() {
  const [selectedMember, setSelectedMember] = useState(null);
  const navigate = useNavigate();

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    navigate('/member');
  };

  const handleBack = () => {
    setSelectedMember(null);
    navigate('/');
  };

  return (
    <div className="App">
      <h1>Library Management System</h1>
      <Routes>
        <Route path="/" element={<MemberList onSelectMember={handleSelectMember} />} />
        <Route path="/member" element={<MemberDetails member={selectedMember} onBack={handleBack} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
