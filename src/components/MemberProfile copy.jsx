import { useEffect, useState } from 'react';
import axios from 'axios';






const MemberProfile = () => {
 console.log("MemberProfile: Component mounted");
 const [member, setMember] = useState(null);

  console.log("MemberProfile: useEffect triggered");

   console.log("MemberProfile: Token from localStorage:");  // Log the token
   //alert(`Token check1 `); // Display the token in an alert (FOR DEBUGGING ONLY)


 useEffect(() => {
  console.log("MemberProfile: useEffect triggered");
  const userString = localStorage.getItem('user'); // Get the JSON string
  const user = userString ? JSON.parse(userString) : null; // Parse it back to an object
  const token = user ? user.token : null; // Safely access the token
  const name = user ? user.username : null; // Safely access the token

  //alert(`member check : ${member.name}`);
 // alert(`userString check : ${userString}`);
console.log("username: " + name);  // Log the token

  console.log("MemberProfile: Token from localStorage:", token);
 // alert(`Token check 2: ${token}`); // Debugging alert
  //alert(`username 2: ${name}`); // Debugging alert
  if (token) { // Only make the request if a token exists
    console.log("MemberProfile: Headers about to be sent:", {
      Authorization: `Bearer ${token}`
    });    
    axios.get('http://localhost:8080/api/members/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log("MemberProfile: axios.get success:", response);
      setMember(response.data);
    })
    .catch(error => {
      console.error("MemberProfile: axios.get error:", error);
      console.error("Error fetching member details:", error);
    });
  } else {
    console.warn("MemberProfile: No token found. Not making API request.");
  }
  console.log("MemberProfile: After axios.get");
}, []);

 if (!member) return <p>Loading memberprofile 1 </p>;

 return (
  <div style={{ maxWidth: '600px', margin: 'auto' }}>
    <h2>Member Profile</h2>
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