import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { memberApi } from '../api';

const MemberDetails = () => {
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = useSelector((state) => state.user); // Get user data from Redux

    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                setLoading(true);
                if (user && user.member && user.member.id) {
                    const data = await memberApi.getMember(user.member.id); // Fetch by member ID
                    setMember(data);
                } else {
                    setError('No member details available.');
                }
            } catch (err) {
                console.error('Error fetching member details:', err);
                setError('Could not load member details.');
            } finally {
                setLoading(false);
            }
        };

        fetchMemberDetails();
    }, [user]); // Re-fetch when user changes

    if