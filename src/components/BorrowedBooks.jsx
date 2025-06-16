// src/components/BorrowedBooks.jsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { loanApi } from '../api';
import './BorrowedBooks.css';
// Import the fallback image as a module
import modernSpacesFallbackImage from '../assets/modernspaces.jpeg'; // Adjust path if necessary

const BorrowedBooks = () => {
  const user = useSelector((state) => state.user); //
  const [loans, setLoans] = useState([]); //
  const [error, setError] = useState(null); //
  const [loading, setLoading] = useState(true); //
  const [selectedLoan, setSelectedLoan] = useState(null); // store full loan instead of just book
  // NEW: State for image load error
  const [imageLoadError, setImageLoadError] = useState(false); //

  // Determine if the user is NOT a ROLE_MEMBER (i.e., Librarian or Admin)
  const isLibrarianOrAdmin = user.roles && (user.roles.includes('ROLE_LIBRARIAN') || user.roles.includes('ROLE_ADMIN'));

  const fetchBorrowedBooks = async () => {
    if (!user || !user.member?.id) { //
      setError('Please log in to view borrowed books.'); //
      setLoading(false); //
      return;
    }

    try {
      const data = await loanApi.getLoansByMemberId(user.member.id); //
      const activeLoans = data.filter(loan => loan.status === 'BORROWED'); //
      setLoans(activeLoans); //
    } catch (err) {
      console.error('Error fetching borrowed books:', err); //
      setError('Could not load borrowed books.'); //
    } finally {
      setLoading(false); //
    }
  };

  useEffect(() => {
    fetchBorrowedBooks(); //
    // Reset image error state when selected loan changes
    setImageLoadError(false); //
  }, [user, selectedLoan]); // Added selectedLoan to dependencies to reset image error

  const handleReturnBook = async () => {
    if (!selectedLoan) return;

    try {
      await loanApi.returnLoan(selectedLoan.id); //
      alert(`Book "${selectedLoan.book.title}" returned successfully.`); //
      setSelectedLoan(null); //
      fetchBorrowedBooks(); //
    } catch (err) {
      console.error('Error returning book:', err); //
      alert('Failed to return the book. Try again later.'); //
    }
  };

  // NEW: Function to handle image loading error
  const handleImageError = () => {
    setImageLoadError(true); //
  };

  if (loading) return <p>Loading borrowed books...</p>; //
  if (error) return <p className="error-message">{error}</p>; //

  // Determine the image source for the selected book
  const displayCoverImageUrl = (selectedLoan && selectedLoan.book.coverImageUrl && !imageLoadError) //
    ? selectedLoan.book.coverImageUrl //
    : modernSpacesFallbackImage; //


  return (
    <div className="borrowed-books-layout">
      {/* Left Column: List of Borrowed Books */}
      <div className="book-list-column">
        <h2>My Borrowed Books</h2>
        {loans.length === 0 ? (
          <p>No books currently borrowed.</p>
        ) : (
          <ul className="book-list">
            {loans.map((loan) => (
              <li
                key={loan.id}
                className={`book-list-item ${selectedLoan?.id === loan.id ? 'selected' : ''}`}
                onClick={() => {
                    setSelectedLoan(loan);
                    setImageLoadError(false); // Reset error when new book is selected
                }}
              >
                <strong>{loan.book.title}</strong>
                <br />
                <small>Due: {loan.dueDate}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Column: Selected Book + Loan Detail */}
      <div className="book-detail-column">
        {selectedLoan ? (
          <div className="book-details-content">
            <div className="book-text-details">
              <h3>Book Details</h3>
              <p><strong>Title:</strong> {selectedLoan.book.title}</p>
              <p><strong>Author:</strong> {selectedLoan.book.author}</p>
              <p><strong>Publisher:</strong> {selectedLoan.book.publisher}</p>
              <p><strong>ISBN:</strong> {selectedLoan.book.isbn}</p>
              <p><strong>Year:</strong> {selectedLoan.book.yearPublished || 'N/A'}</p>
              <p><strong>Category:</strong> {selectedLoan.book.category}</p>
              <p><strong>Total Copies:</strong> {selectedLoan.book.totalCopies || 0}</p>

              <h4>Loan Info</h4>
              <p><strong>Status:</strong> {selectedLoan.status}</p>
              <p><strong>Borrowed On:</strong> {selectedLoan.borrowDate}</p>
              <p><strong>Due Date:</strong> {selectedLoan.dueDate}</p>
              {/* MODIFIED: Apply conditional class for fine */}
              <p>
                <strong>Fine:</strong> {' '}
                <span className={selectedLoan.fine > 0 ? 'fine-amount-highlight' : ''}>
                  ${selectedLoan.fine ? selectedLoan.fine.toFixed(2) : '0.00'}
                </span>
              </p>

              <div className="button-group">
                <button onClick={() => setSelectedLoan(null)}>Close</button>
                {/* CONDITIONAL RENDERING: Only show Return Book button if user is Librarian or Admin */}
                {isLibrarianOrAdmin && (
                    <button onClick={handleReturnBook} className="return-button">Return Book</button>
                )}
              </div>
            </div>

            {/* NEW: Book Cover Image on the right */}
            {displayCoverImageUrl && (
                <div className="book-cover-container">
                    <img
                        src={displayCoverImageUrl}
                        alt={`${selectedLoan.book.title} Cover`}
                        className="borrowed-book-cover-image"
                        onError={handleImageError}
                    />
                </div>
            )}
          </div>
        ) : (
          <p>Select a book on the left to view details.</p>
        )}
      </div>
    </div>
  );
};

export default BorrowedBooks;