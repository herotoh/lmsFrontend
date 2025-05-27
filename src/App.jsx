import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MemberList from './components/MemberList';
import MemberDetails from './components/MemberDetails';
import './App.css';

function App() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="App">
      <h1>Library Management System</h1>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <MemberList
                onSelectMember={(member) => {
                  setSelectedMember(member);
                  window.history.pushState(null, '', '/member');
                }}
              />
            }
          />
          <Route
            path="/member"
            element={
              <MemberDetails
                member={selectedMember}
                onBack={() => {
                  setSelectedMember(null);
                  window.history.pushState(null, '', '/');
                }}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
