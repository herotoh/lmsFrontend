import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { loanApi } from '../api';
import './BorrowedBooks.css';

const BorrowedBooks = () => {
  const user = useSelector((state) => state.user);
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBorrowedBooks = async () => {
    if (!user || !user.member?.id) {
      setError('Please log in to view borrowed books.');
      setLoading(false);
      return;
    }

    try {
      const data = await loanApi.getLoansByMemberId(user.member.id);
      const activeLoans = data.filter(loan => loan.status === 'BORROWED'); // ✅ Filter only active loans
      setLoans(activeLoans);
    } catch (err) {
      console.error('Error fetching borrowed books:', err);
      setError('Could not load borrowed books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, [user]);

  const handleReturnBook = async () => {
    const loan = loans.find((l) => l.book.id === selectedBook.id);
    if (!loan) {
      alert('Loan not found for this book.');
      return;
    }

    try {
      await loanApi.returnLoan(loan.id);
      alert(`Book "${selectedBook.title}" returned successfully.`);
      setSelectedBook(null);
      fetchBorrowedBooks(); // Refresh list
    } catch (err) {
      console.error('Error returning book:', err);
      alert('Failed to return the book. Try again later.');
    }
  };

  if (loading) return <p>Loading borrowed books...</p>;
  if (error) return <p className="error-message">{error}</p>;

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
                className={`book-list-item ${selectedBook?.id === loan.book.id ? 'selected' : ''}`}
                onClick={() => setSelectedBook(loan.book)}
              >
                <strong>{loan.book.title}</strong>
                <br />
                <small>Due: {loan.dueDate}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Column: Selected Book Detail */}
      <div className="book-detail-column">
        {selectedBook ? (
          <div className="book-details">
            <h3>Book Details</h3>
            <p><strong>Title:</strong> {selectedBook.title}</p>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Publisher:</strong> {selectedBook.publisher}</p>
            <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
            <p><strong>Year:</strong> {selectedBook.year}</p>
            <p><strong>Category:</strong> {selectedBook.category}</p>
            <p><strong>Quantity:</strong> {selectedBook.quantity}</p>

            <div className="button-group">
              <button onClick={() => setSelectedBook(null)}>Close</button>
              <button onClick={handleReturnBook} className="return-button">Return Book</button>
            </div>
          </div>
        ) : (
          <p>Select a book on the left to view details.</p>
        )}
      </div>
    </div>
  );
};

export default BorrowedBooks;
