// src/components/MemberDetails.jsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { memberApi } from '../api';
import { loanApi } from '../api';

const MemberDetails = () => {
  const { id } = useParams();
  const currentUser = useSelector((state) => state.user);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [memberLoans, setMemberLoans] = useState([]);
  const [loanLoading, setLoanLoading] = useState(true);
  const [loanError, setLoanError] = useState(null);

  const isAdmin = currentUser.roles && currentUser.roles.includes('ROLE_ADMIN');
  // NEW: Check if current user is Librarian or Admin for return functionality
  const isLibrarianOrAdmin = currentUser.roles && (currentUser.roles.includes('ROLE_LIBRARIAN') || currentUser.roles.includes('ROLE_ADMIN'));

  useEffect(() => {
    const fetchMemberData = async () => {
      setLoading(true);
      setError(null);
      try {
        let fetchedMember = null;
        if (id) {
          fetchedMember = await memberApi.getMember(id);
        } else if (currentUser?.member?.id) {
          setError("No member ID provided in the URL.");
          setLoading(false);
          return;
        } else {
          setError("No member ID provided and no current user profile to display.");
          setLoading(false);
          return;
        }
        setMember(fetchedMember);
      } catch (err) {
        console.error('Error fetching member details:', err.response?.data || err);
        setError(err.response?.data?.message || 'Could not load member details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [id, currentUser]);

  useEffect(() => {
    const fetchLoansForMember = async () => {
      if (!id) {
        setLoanLoading(false);
        return;
      }
      setLoanLoading(true);
      setLoanError(null);
      try {
        const data = await loanApi.getLoansByMemberId(id);
        const activeBorrowedLoans = data.filter(loan => loan.status === 'BORROWED');
        setMemberLoans(activeBorrowedLoans);
      } catch (err) {
        console.error('Error fetching member loans:', err.response?.data || err);
        setLoanError('Could not load member loans.');
      } finally {
        setLoanLoading(false);
      }
    };

    fetchLoansForMember();
  }, [id]);

  const handleUpdateMember = () => {
    if (member && id) {
      navigate(`/profile/${id}`);
    } else {
      alert("Cannot update: Member data not loaded or ID missing.");
    }
  };

  const handleDeleteMember = async () => {
    if (!isAdmin) {
      alert("You do not have permission to delete members.");
      return;
    }

    if (!member || !id) {
      alert("Cannot delete: Member data not loaded or ID missing.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete member "${member.name}" (ID: ${member.id})? This action cannot be undone.`)) {
      try {
        await memberApi.deleteMember(id);
        alert(`Member "${member.name}" deleted successfully!`);
        navigate('/members');
      } catch (err) {
        console.error('Error deleting member:', err.response?.data || err);
        setError(err.response?.data?.message || 'Failed to delete member.');
      }
    }
  };

  // NEW: Handle return book from this view
  const handleReturnBookFromDetails = async (loanId, bookTitle) => {
    if (!isLibrarianOrAdmin) {
      alert("You do not have permission to return books from this view.");
      return;
    }

    if (window.confirm(`Are you sure you want to mark "${bookTitle}" as returned?`)) {
      setLoanError(null); // Clear any previous loan errors
      try {
        await loanApi.returnLoan(loanId);
        alert(`Book "${bookTitle}" returned successfully!`);
        // Refresh the list of loans for this member
        // By calling fetchLoansForMember, we'll re-fetch and re-filter
        if (id) { // Ensure id is available before fetching
            const data = await loanApi.getLoansByMemberId(id);
            const activeBorrowedLoans = data.filter(loan => loan.status === 'BORROWED');
            setMemberLoans(activeBorrowedLoans);
        }
      } catch (err) {
        console.error('Error returning book:', err.response || err);
        setLoanError(err.response?.data?.message || 'Failed to return book.');
      }
    }
  };

  if (loading) return <p>Loading member details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!member) return <p>No member information available. This could happen if the ID is invalid or not provided.</p>;

  return (
    <div className="member-details-page-layout">
      <div className="member-details-container">
        <h2>Member Details for {member.name}</h2>
        <p><strong>Name:</strong> {member.name || 'N/A'}</p>
        <p><strong>Address:</strong> {member.address || 'N/A'}</p>
        <p><strong>Contact Info:</strong> {member.contactInfo || 'N/A'}</p>
        <p><strong>Email:</strong> {member.email || 'N/A'}</p>
        <p><strong>NRIC:</strong> {member.nric || 'N/A'}</p>
        <p><strong>Mobile:</strong> {member.mobile || 'N/A'}</p>
        <p><strong>Birthday:</strong> {member.birthday || 'N/A'}</p>
        <p><strong>Sex:</strong> {member.sex || 'N/A'}</p>
        <p><strong>Registration Date:</strong> {member.registrationDate || 'N/A'}</p>
        <p><strong>Membership Expiry Date:</strong> {member.membershipExpiryDate || 'N/A'}</p>
        <p><strong>Remark:</strong> {member.remark || 'N/A'}</p>

        {/* Action Buttons */}
        <div className="member-actions">
          {isAdmin && (
            <>
              <button className="update-button" onClick={handleUpdateMember}>Update Member</button>
              <button className="delete-button" onClick={handleDeleteMember}>Delete Member</button>
            </>
          )}
        </div>
      </div>

      {/* Right Column for Borrowed Books */}
      <div className="member-loans-column">
        <h3>Currently Borrowed Books</h3>
        {loanLoading && <p>Loading borrowed books...</p>}
        {loanError && <p className="error-message">{loanError}</p>}
        {!loanLoading && !loanError && memberLoans.length === 0 && (
          <p>This member currently has no borrowed books.</p>
        )}
        {!loanLoading && !loanError && memberLoans.length > 0 && (
          <ul className="borrowed-books-list">
            {memberLoans.map(loan => (
              <li key={loan.id} className="borrowed-loan-item">
                <div className="loan-item-details"> {/* NEW: Wrapper for text details */}
                    <strong>{loan.book.title}</strong> by {loan.book.author}
                    <br />
                    Loan Date: {loan.borrowDate}
                    <br />
                    Due Date: {loan.dueDate}
                    {loan.fine > 0 && (
                    <span className="fine-info"> - Fine: ${loan.fine.toFixed(2)}</span>
                    )}
                    <br />
                    Status: {loan.status}
                </div>
                {/* NEW: Return Button for Librarians/Admins */}
                {isLibrarianOrAdmin && (
                    <button
                        className="return-loan-button"
                        onClick={() => handleReturnBookFromDetails(loan.id, loan.book.title)}
                        disabled={loan.status !== 'BORROWED'} // Disable if not actively borrowed
                    >
                        Return
                    </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MemberDetails;