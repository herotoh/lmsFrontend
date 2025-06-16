import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MemberProfile.css'; // Import the CSS file
import { useParams } from 'react-router-dom'; // Import useParams
import { useSelector } from 'react-redux'; // Assuming you use Redux for user auth

const MemberProfile = () => {
    // Get the ID from the URL parameters (if navigating to /members/:id)
    const { id: urlMemberId } = useParams();

    // Get user info from Redux store for token and roles
    const currentUser = useSelector((state) => state.user);

    const [member, setMember] = useState(null); // State for displayed member data
    const [editMember, setEditMember] = useState(null); // State for editable member data
    const [isEditingMember, setIsEditingMember] = useState(false);

    const [userAccountInfo, setUserAccountInfo] = useState(null); // State for user account data (username, roles)
    const [editUserAccount, setEditUserAccount] = useState({ role: '', password: '' }); // State for editable user account data
    const [isEditingUserAccount, setIsEditingUserAccount] = useState(false);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            setError(null);

            const token = currentUser?.token;

            if (!token) {
                setError('Authentication token not found. Please log in.');
                setLoading(false);
                return;
            }

            try {
                let memberDataResponse;
                let userAccountDataResponse;

                // Determine which member profile to fetch
                if (urlMemberId) {
                    // If an ID is in the URL, fetch that specific member's profile
                    // This typically requires admin/librarian privileges on the backend
                    memberDataResponse = await axios.get(`http://localhost:8080/api/members/${urlMemberId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    // If fetching a specific member, we might also need their associated user info
                    
                    //userAccountDataResponse = await axios.get(`http://localhost:8080/api/users/member/${urlMemberId}`, { // Assuming this endpoint exists to get user by memberId
                    //  userAccountDataResponse = await axios.get(`http://localhost:8080/api/members/member/${urlMemberId}`, { // Assuming this endpoint exists to get user by memberId
                    userAccountDataResponse = await axios.get(`http://localhost:8080/api/members/${urlMemberId}`, { // Assuming this endpoint exists to get user by memberId
                        headers: { Authorization: `Bearer ${token}` },
                    });
                } else {
                    // If no ID in URL, fetch the logged-in user's own profile
                    memberDataResponse = await axios.get('http://localhost:8080/api/members/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    // For 'me' endpoint, current user info from Redux is often sufficient,
                    // but you might want to fetch full user details if 'members/me' doesn't return everything
                    userAccountDataResponse = { data: {
                        username: currentUser.username,
                        roles: currentUser.roles // Assuming roles come with currentUser from Redux
                    }};
                }

                setMember(memberDataResponse.data);
                setEditMember(memberDataResponse.data);

                // Assuming userAccountDataResponse.data contains username and roles array
                // Adjust this based on your actual backend response for /api/users/member/{memberId}
                
                const fetchedUserAccount = userAccountDataResponse.data;
                setUserAccountInfo(fetchedUserAccount);

                // Set initial editable role, handling potential 'ROLE_' prefix
                const initialRole = fetchedUserAccount.roles?.[0]?.replace('ROLE_', '') || '';
                setEditUserAccount({ role: initialRole, password: '' });

            } catch (err) {
                console.error('Error fetching profile details:', err);
                setError(
                    err.response?.data?.message || 'Could not load profile details.'
                );
            } finally {
                setLoading(false);
            }
        };

        // Fetch data only if currentUser is available
        if (currentUser) {
            fetchProfileData();
        }

    }, [currentUser, urlMemberId]); // Re-run effect if currentUser or URL member ID changes

    const handleMemberInputChange = (e) => {
        const { name, value } = e.target;
        setEditMember((prev) => ({ ...prev, [name]: value }));
    };

    const handleUserAccountInputChange = (e) => {
        const { name, value } = e.target;
        setEditUserAccount((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveMember = async () => {
        setLoading(true);
        setError(null);
        const token = currentUser?.token; // Use currentUser for token
        try {
            const targetMemberId = urlMemberId || member.id; // Use URL ID or current member's ID
            const response = await axios.put(
                `http://localhost:8080/api/members/${targetMemberId}`,
                editMember,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMember(response.data);
            setIsEditingMember(false);
            alert('Member information updated successfully!');
        } catch (error) {
            console.error('Error updating member:', error);
            setError(error.response?.data?.message || 'Failed to update member profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveUserAccount = async () => {
        setLoading(true);
        setError(null);
        const token = currentUser?.token; // Use currentUser for token
        try {
            // Determine the user ID to update: either from the fetched userAccountInfo
            // or from the current user in Redux if it's the 'me' profile.
            // Assuming your backend expects a user ID in the path, not username.
            // You might need to fetch the user ID associated with the member ID if not already available.
            const targetUserId = userAccountInfo?.id; // Assuming userAccountInfo has an 'id' for the user
            if (!targetUserId) {
                throw new Error("User ID not available for update.");
            }

            const payloadRole = editUserAccount.role.startsWith('ROLE_') ? editUserAccount.role : `ROLE_${editUserAccount.role}`;

            await axios.put(
                `http://localhost:8080/api/users/${targetUserId}/update-role-password`,
                {
                    // Send role with 'ROLE_' prefix if not already present
                    role: payloadRole,
                    password: editUserAccount.password,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert('User account updated successfully!');
            setIsEditingUserAccount(false);
            // Optionally, refresh user info in Redux or fetch it again if roles changed
            // This might involve re-dispatching loginUser or fetching user details
            // For simplicity here, we're not automatically updating Redux user.roles,
            // but a page refresh would reflect changes.
        } catch (error) {
            console.error('Error updating user info:', error);
            setError(error.response?.data?.message || 'Failed to update user account.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelMember = () => {
        setEditMember(member); // Revert changes
        setIsEditingMember(false);
    };

    const handleCancelUserAccount = () => {
        setIsEditingUserAccount(false);
        // Revert user account edit state to current displayed info
        const currentRole = userAccountInfo?.roles?.[0]?.replace('ROLE_', '') || '';
        setEditUserAccount({ role: currentRole, password: '' });
    };

    // Role-based rendering for Edit buttons
    // Assuming ADMIN can edit any profile, LIBRARIAN can edit MEMBER profiles, MEMBER can edit their own
    const canEditMemberInfo = () => {
        if (!currentUser || !currentUser.roles) return false;
        const isAdmin = currentUser.roles.includes('ROLE_ADMIN');
        const isLibrarian = currentUser.roles.includes('ROLE_LIBRARIAN');
        const isOwner = currentUser.member?.id === member?.id; // Check if logged-in user is the owner of the profile

        // Admins can edit any member info
        if (isAdmin) return true;
        // Librarians can edit any member info
        if (isLibrarian) return true;
        // Owners can edit their own member info (e.g., address, contact)
        if (isOwner && !urlMemberId) return true; // Allow owner to edit if viewing their own profile (no ID in URL)
        return false;
    };

    const canEditUserAccount = () => {
        if (!currentUser || !currentUser.roles || !userAccountInfo) return false;
        const isAdmin = currentUser.roles.includes('ROLE_ADMIN');
        const isOwner = currentUser.username === userAccountInfo.username; // Check if logged-in user is the owner of the user account

        // Admins can edit any user account
        if (isAdmin) return true;
        // Owners can edit their own user account (password, maybe role if allowed)
        if (isOwner && !urlMemberId) return true; // Allow owner to edit their own user account (not when viewing others via ID)
        return false;
    };


    if (loading) return <p className="loading-message">Loading profile...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!member) return <p className="loading-message">Member profile not found.</p>;


    // Determine the role to display (remove ROLE_ prefix)
    const displayedRole = userAccountInfo?.roles?.[0]?.replace('ROLE_', '') || 'N/A';


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
                            field === 'sex' ? ( // Special handling for 'sex' as a dropdown
                                <select name="sex" value={editMember?.sex || ''} onChange={handleMemberInputChange}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            ) : field === 'birthday' || field === 'registrationDate' || field === 'membershipExpiryDate' ? (
                                // For date fields, you might want a date input or careful formatting
                                <input
                                    type="date" // Use type="date" for date fields
                                    name={field}
                                    value={editMember?.[field] || ''}
                                    onChange={handleMemberInputChange}
                                />
                            ) : (
                                <input
                                    type="text"
                                    name={field}
                                    value={editMember?.[field] || ''}
                                    onChange={handleMemberInputChange}
                                />
                            )
                        ) : (
                            <span>{member[field] ? member[field].toString() : 'N/A'}</span>
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
                    {canEditMemberInfo() && (
                        isEditingMember ? (
                            <>
                                <button onClick={handleSaveMember} disabled={loading}>Save</button>
                                <button onClick={handleCancelMember} disabled={loading}>Cancel</button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditingMember(true)} disabled={loading}>Edit Member Info</button>
                        )
                    )}
                </div>
            </div>

            {/* Right Column - User Info */}
            <div className="profile-section user-info">
                <h2>User Account</h2>
                <div className="profile-field-row">
                    <label>Username:</label>
                    <span>{userAccountInfo?.username || 'N/A'}</span>
                </div>

                <div className="profile-field-row">
                    <label>Role:</label>
                    {isEditingUserAccount ? (
                        <select name="role" value={editUserAccount.role} onChange={handleUserAccountInputChange}>
                            <option value="ROLE_ADMIN">ADMIN</option>
                            <option value="ROLE_MEMBER">MEMBER</option>
                            <option value="ROLE_LIBRARIAN">LIBRARIAN</option>
                        </select>
                    ) : (
                        <span>{displayedRole}</span>
                    )}
                </div>

                <div className="profile-field-row">
                    <label>Password:</label>
                    {isEditingUserAccount ? (
                        <input
                            type="password"
                            name="password"
                            value={editUserAccount.password}
                            onChange={handleUserAccountInputChange}
                            placeholder="Enter new password"
                        />
                    ) : (
                        <span>••••••••</span>
                    )}
                </div>

                <div className="profile-actions">
                    {canEditUserAccount() && (
                        isEditingUserAccount ? (
                            <>
                                <button onClick={handleSaveUserAccount} disabled={loading}>Save</button>
                                <button onClick={handleCancelUserAccount} disabled={loading}>Cancel</button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditingUserAccount(true)} disabled={loading}>Edit Role & Password</button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemberProfile;