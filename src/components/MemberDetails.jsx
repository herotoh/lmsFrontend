//import React from 'react';
import { useSelector } from 'react-redux';

const MemberDetails = () => {
  const member = useSelector((state) => state.user);

  if (!member || !member.name) {
    return (
      <div>
        <p>No member information available. Please login first.</p>
      </div>
    );
  }
  return (
    <div>
      <h2>Member Details</h2>
      <p><strong>Username:</strong> {member.name}</p>
      <p><strong>Roles:</strong> {member.roles?.join(', ') || 'N/A'}</p>
      <p><strong>Name:</strong> {member.name || 'N/A'}</p>
      <p><strong>Address:</strong> {member.address || 'N/A'}</p>
      <p><strong>Contact Info:</strong> {member.contactInfo || 'N/A'}</p>
      <p><strong>Email:</strong> {member.email || 'N/A'}</p>
      <p><strong>NRIC:</strong> {member.nric || 'N/A'}</p>
      <p><strong>Mobile:</strong> {member.mobile || 'N/A'}</p>
      <p><strong>Remark:</strong> {member.remark || 'N/A'}</p>
      <p><strong>Birthday:</strong> {member.birthday || 'N/A'}</p>
      <p><strong>Sex:</strong> {member.sex || 'N/A'}</p>
      <p><strong>Registration Date:</strong> {member.registrationDate || 'N/A'}</p>
      <p><strong>Membership Expiry Date:</strong> {member.membershipExpiryDate || 'N/A'}</p>
    </div>
  );
};

export default MemberDetails;
