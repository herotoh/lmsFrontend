import { useEffect, useState } from 'react';
import axios from 'axios';

const MemberProfile = () => {
  const [member, setMember] = useState(null);
  const [editMember, setEditMember] = useState(null); // For editing state
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const token = user?.token;

    if (token) {
      axios.get('http://localhost:8080/api/members/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setMember(response.data);
        setEditMember(response.data); // Initialize editable copy
      })
      .catch(error => {
        console.error("Error fetching member details:", error);
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditMember({ ...editMember, [name]: value });
  };

  const handleSave = async () => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const token = user?.token;

    try {
      const response = await axios.put(
        `http://localhost:8080/api/members/${member.id}`,
        editMember,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMember(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating member:", error);
      alert("Failed to update member profile.");
    }
  };

  const handleCancel = () => {
    setEditMember(member);
    setIsEditing(false);
  };

  if (!member) return <p>Loading member profile...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>My Member Profile</h2>

      {["name", "address", "contactInfo", "email", "nric", "mobile", "birthday", "sex", "remark"].map((field) => (
        <div key={field} style={{ marginBottom: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
          </label>
          {isEditing ? (
            <input
              type="text"
              name={field}
              value={editMember?.[field] || ''}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '6px', marginTop: '4px' }}
            />
          ) : (
            <p>{member[field]}</p>
          )}
        </div>
      ))}

      <div>
        <strong>Registration Date:</strong> {member.registrationDate}<br />
        <strong>Membership Expiry:</strong> {member.membershipExpiryDate}
      </div>

      <div style={{ marginTop: '20px' }}>
        {isEditing ? (
          <>
            <button onClick={handleSave} style={{ marginRight: '10px' }}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  );
};

export default MemberProfile;
