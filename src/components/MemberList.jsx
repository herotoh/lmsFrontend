import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/members');
        setMembers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch members. Please ensure the backend is running.');
        setError(err.message); // Log the error message for debugging
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/members/${id}`);
  };

  if (loading) return <p>Loading members...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Members List</h2>
      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Contact Info</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{member.id}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{member.name}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{member.contactInfo}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  <button onClick={() => handleViewDetails(member.id)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MemberList;
