import { useEffect, useState } from 'react';
import axios from 'axios';

const MemberProfile = () => {
  const [member, setMember] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/members/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // If JWT auth
      }
    }).then(response => {
      setMember(response.data);
    }).catch(error => {
      console.error("Error fetching member details:", error);
    });
  }, []);

  if (!member) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>My Member Profile</h2>
      <p><strong>Name:</strong> {member.name}</p>
      <p><strong>Address:</strong> {member.address}</p>
      <p><strong>Contact Info:</strong> {member.contactInfo}</p>
      <p><strong>Email:</strong> {member.email}</p>
      <p><strong>NRIC:</strong> {member.nric}</p>
      <p><strong>Mobile:</strong> {member.mobile}</p>
      <p><strong>Birthday:</strong> {member.birthday}</p>
      <p><strong>Sex:</strong> {member.sex}</p>
      <p><strong>Registration Date:</strong> {member.registrationDate}</p>
      <p><strong>Membership Expiry:</strong> {member.membershipExpiryDate}</p>
      <p><strong>Remark:</strong> {member.remark}</p>
    </div>
  );
};

export default MemberProfile;
