import { useEffect, useState } from 'react';
import axios from 'axios';
import './MemberProfile.css';

const MemberProfile = () => {
  const [member, setMember] = useState(null);
  const [editMember, setEditMember] = useState(null);
  const [isEditingMember, setIsEditingMember] = useState(false);

  const [userInfo, setUserInfo] = useState(null);
  const [editUser, setEditUser] = useState({ role: '', password: '' });
  const [isEditingUser, setIsEditingUser] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    setUserInfo(user);
    const token = user?.token;

    if (token) {
      axios
        .get('http://localhost:8080/api/members/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMember(response.data);
          setEditMember(response.data);
        })
        .catch((error) => {
          console.error('Error fetching member details:', error);
        });

      // Set initial editable role and password
      setEditUser({ role: user?.roles?.[0]?.replace('ROLE_', '') || '', password: '' });
    }
  }, []);

  const handleMemberInputChange = (e) => {
    const { name, value } = e.target;
    setEditMember({ ...editMember, [name]: value });
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleSaveMember = async () => {
    const token = userInfo?.token;
    try {
      const response = await axios.put(
        `http://localhost:8080/api/members/${member.id}`,
        editMember,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMember(response.data);
      setIsEditingMember(false);
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Failed to update member profile.');
    }
  };

  const handleSaveUser = async () => {
    const token = userInfo?.token;
    try {
      await axios.put(
        `http://localhost:8080/api/users/${userInfo.username}/update-role-password`,
        {
          role: editUser.role,
          password: editUser.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('User info updated successfully!');
      setIsEditingUser(false);
    } catch (error) {
      console.error('Error updating user info:', error);
      alert('Failed to update user account.');
    }
  };

  const handleCancelMember = () => {
    setEditMember(member);
    setIsEditingMember(false);
  };

  const handleCancelUser = () => {
    setIsEditingUser(false);
    setEditUser({
      role: userInfo?.roles?.[0]?.replace('ROLE_', '') || '',
      password: '',
    });
  };

  if (!member) return <p className="loading-message">Loading member profile...</p>;

  return (
    <div className="profile-grid-container">
      {/* Left Column - Member Info */}
      <div className="profile-section member-info">
        <h2>Member Information</h2>
        {[
          'name',
          'address',
          'contactInfo',
          'email',
          'nric',
          'mobile',
          'birthday',
          'sex',
          'remark',
        ].map((field) => (
          <div key={field} className="profile-field-row">
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            {isEditingMember ? (
              <input
                type="text"
                name={field}
                value={editMember?.[field] || ''}
                onChange={handleMemberInputChange}
              />
            ) : (
              <span>{member[field]}</span>
            )}
          </div>
        ))}

        <div className="profile-field-row">
          <label>Registration Date:</label>
          <span>{member.registrationDate}</span>
        </div>
        <div className="profile-field-row">
          <label>Membership Expiry:</label>
          <span>{member.membershipExpiryDate}</span>
        </div>

        <div className="profile-actions">
          {isEditingMember ? (
            <>
              <button onClick={handleSaveMember}>Save</button>
              <button onClick={handleCancelMember}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditingMember(true)}>Edit Member Info</button>
          )}
        </div>
      </div>

      {/* Right Column - User Info */}
      <div className="profile-section user-info">
        <h2>User Account</h2>
        <div className="profile-field-row">
          <label>Username:</label>
          <span>{userInfo?.username}</span>
        </div>

        <div className="profile-field-row">
          <label>Role:</label>
          {isEditingUser ? (
            <select name="role" value={editUser.role} onChange={handleUserInputChange}>
              <option value="ADMIN">ADMIN</option>
              <option value="MEMBER">MEMBER</option>
              <option value="LIBRARIAN">LIBRARIAN</option>
            </select>
          ) : (
            <span>{editUser.role}</span>
          )}
        </div>

        <div className="profile-field-row">
          <label>Password:</label>
          {isEditingUser ? (
            <input
              type="password"
              name="password"
              value={editUser.password}
              onChange={handleUserInputChange}
            />
          ) : (
            <span>••••••••</span>
          )}
        </div>

        <div className="profile-actions">
          {isEditingUser ? (
            <>
              <button onClick={handleSaveUser}>Save</button>
              <button onClick={handleCancelUser}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditingUser(true)}>Edit Role & Password</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
