import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useSelector } from 'react-redux'; // Import useSelector
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/userSlice';
import api from '../axiosConfig'; // Import your api.js for consistent requests

const MemberProfile = () => {
    console.log("MemberProfile: Component mounted");
    const [member, setMember] = useState(null);
    const [editing, setEditing] = useState(false); // Track if we're editing
    const [form, setForm] = useState({}); // Use an object for the form
    const [errors, setErrors] = useState({}); // For form validation errors
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user); // Get user from Redux
    const token = user?.token; // Safely access token from Redux

      console.log("MemberProfile: Token from localStorage:", token);
      
    useEffect(() => {
        const fetchMemberProfile = async () => {
            console.log("MemberProfile: useEffect triggered");
            try {
                //const token = user?.token; // Safely access token from Redux
                if (!token) {
                    console.warn("MemberProfile: No token found. Redirecting to login.");
                    navigate('/login'); // Redirect if no token
                    return;
                }

                const response = await api.get('/member/me'); // Use api.js
                console.log("MemberProfile: axios.get success:", response);
                setMember(response.data);
                setForm(response.data); // Initialize form with member data

            } catch (error) {
                console.error("MemberProfile: axios.get error:", error);
                console.error("Error fetching member details:", error);
                // Handle error (e.g., redirect to login, show error message)
            }
            console.log("MemberProfile: After axios.get");
        };

        fetchMemberProfile();
    }, []); // Fetch on mount, and when user changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!form.name || form.name.trim() === '') {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }

        // Add validations for other fields as needed

        setErrors(newErrors);
        return isValid;
    };


    const handleEditClick = () => {
        setEditing(true);
    };

    const handleCancelClick = () => {
        setEditing(false);
        setForm(member); // Reset form to original data
        setErrors({}); // Clear any errors
    };

    const handleSaveClick = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const response = await api.put(`/members/${member.id}`, form); // Use api.js
            console.log("Member update response:", response);
            setMember(response.data);
            setEditing(false);
            dispatch(loginUser({ ...user, member: response.data })); // Update Redux store
            localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), member: response.data })); // Update localStorage
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating member:", error);
            // Handle error (e.g., show error message)
            alert("Failed to update profile.");
        }
    };

    const renderDisplayMode = () => (
        <div>
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
            <button onClick={handleEditClick}>Edit Profile</button>
        </div>
    );

    const renderEditMode = () => (
        <form onSubmit={(e) => e.preventDefault()}>
            <h2>Edit Member Profile</h2>
            {errors.name && <p className="error-message">{errors.name}</p>}
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={form.name || ''} onChange={handleChange} />
            </div>

            {errors.address && <p className="error-message">{errors.address}</p>}
            <div>
                <label>Address:</label>
                <input type="text" name="address" value={form.address || ''} onChange={handleChange} />
            </div>

            {errors.contactInfo && <p className="error-message">{errors.contactInfo}</p>}
            <div>
                <label>Contact Info:</label>
                <input type="text" name="contactInfo" value={form.contactInfo || ''} onChange={handleChange} />
            </div>

            {errors.email && <p className="error-message">{errors.email}</p>}
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={form.email || ''} onChange={handleChange} />
            </div>

            <div>
                <label>NRIC:</label>
                <input type="text" name="nric" value={form.nric || ''} onChange={handleChange} />
            </div>

            <div>
                <label>Mobile:</label>
                <input type="text" name="mobile" value={form.mobile || ''} onChange={handleChange} />
            </div>

            <div>
                <label>Birthday:</label>
                <input type="date" name="birthday" value={form.birthday ? form.birthday.split('T')[0] : ''} onChange={handleChange} />
            </div>

            <div>
                <label>Sex:</label>
                <select name="sex" value={form.sex || ''} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="">Select Sex</option>
                </select>
            </div>

            <div>
                <label>Remark:</label>
                <input type="text" name="remark" value={form.remark || ''} onChange={handleChange} />
            </div>

            <button onClick={handleSaveClick}>Save</button>
            <button onClick={handleCancelClick}>Cancel</button>
        </form>
    );

    if (!member) return <p>Loading member profile...</p>;

    return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
            {editing ? renderEditMode() : renderDisplayMode()}
        </div>
    );
};

export default MemberProfile;