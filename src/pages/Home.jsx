import { useState } from 'react';
import MemberList from '../components/MemberList';
import MemberDetails from '../components/MemberDetails';

const Home = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  const handleSelectMember = (member) => setSelectedMember(member);
  const handleBack = () => setSelectedMember(null);

  return (
    <div>
      {selectedMember ? (
        <MemberDetails member={selectedMember} onBack={handleBack} />
      ) : (
        <MemberList onSelectMember={handleSelectMember} />
      )}
    </div>
  );
};

export default Home;
