import { useState, useEffect } from 'react';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { memberApi } from '../api'; // Use the abstracted API calls
import { useSelector } from 'react-redux'; // To check user roles for authorization

import './MemberList.css'; // You'll create this CSS file


const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMembers = async () => {   
    
      const isAdmin = user.roles && user.roles.includes('ROLE_ADMIN');    
      const isLibrarian = user.roles && user.roles.includes('ROLE_LIBRARIAN');
      //const isAdmin = user.roles && user.roles.includes('ADMIN');    
      //const isLibrarian = user.roles && user.roles.includes('LIBRARIAN');

                  if (!isAdmin && !isLibrarian) {
                    console.log("user.roles:", user.roles);

                setError("You don't have permission to view members.");
                setLoading(false);
                return;
            }

      try {
        //const response = await axios.get('http://localhost:8080/api/members');
        setLoading(true);
        const data = await memberApi.getMembers(); // Call the API to get all members
        setMembers(data);
        //setMembers(response.data);        
      } catch (err) {
        setError('Failed to fetch members. Please ensure the backend is running.');
        setError(err.message); // Log the error message for debugging
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [user]);

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
                
                <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold', color: 'darkblue' }}>
  {member.name}
</td>
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
