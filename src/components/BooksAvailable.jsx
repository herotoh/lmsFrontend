import React, { useEffect, useState } from 'react';
import { bookApi } from '../api';
import { loanApi } from '../api';
import { useSelector } from 'react-redux';
import './BooksAvailable.css';
import UpdateBookForm from './UpdateBookForm';
import BookDetailsModal from './BookDetailsModal'; // We will create this component

const BooksAvailable = () => {
  const [allAvailableBooks, setAllAvailableBooks] = useState([]); // Store all available books
  const [displayedBooks, setDisplayedBooks] = useState([]); // Books currently displayed
  const [categories, setCategories] = useState([]); // List of unique categories with available books
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // Currently selected category (default to 'ALL')

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBookForUpdate, setSelectedBookForUpdate] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBookForDetails, setSelectedBookForDetails] = useState(null);
  const user = useSelector((state) => state.user);

  const isAdminOrLibrarian = user.roles && (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_LIBRARIAN'));

  const fetchAvailableBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookApi.getAvailableBooks(); // Fetches all books with available copies > 0
      setAllAvailableBooks(data); // Store the full list

      // Process categories from available books
      const uniqueCategories = ['ALL', ...new Set(data.map(book => book.category))];
      setCategories(uniqueCategories);

      // Initially display all books
      setDisplayedBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Could not load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableBooks();
  }, []); // Run once on component mount

  // NEW: Effect to filter books when selectedCategory or allAvailableBooks changes
  useEffect(() => {
    if (selectedCategory === 'ALL') {
      setDisplayedBooks(allAvailableBooks);
    } else {
      setDisplayedBooks(allAvailableBooks.filter(book => book.category === selectedCategory));
    }
  }, [selectedCategory, allAvailableBooks]); // Re-filter when category or source books change

  const handleBorrowBook = async (bookId) => {
    setError(null);

    if (!user?.member?.id) {
      setError("User information is incomplete. Please log in again.");
      return;
    }

    try {
      await loanApi.borrowBook(bookId, user.member.id);
      // Update local state for immediate feedback
      setAllAvailableBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId
            ? { ...book, availableCopies: book.availableCopies - 1 }
            : book
        )
      );
      // No need to call setDisplayedBooks here, as the useEffect will re-filter
      alert("Book borrowed successfully!");
    } catch (err) {
      console.error("Error borrowing book:", err);
      setError("Could not borrow book. Please try again.");
    }
  };

  const handleUpdateClick = (book) => {
    setSelectedBookForUpdate(book);
    setShowUpdateModal(true);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    setSelectedBookForUpdate(null);
    fetchAvailableBooks(); // Re-fetch all books to ensure data is fresh after update
    alert('Book updated successfully!');
  };

  const handleUpdateCancel = () => {
    setShowUpdateModal(false);
    setSelectedBookForUpdate(null);
  };

  const handleDeleteBook = async (bookId, bookTitle) => {
    if (!isAdminOrLibrarian) {
        alert("You do not have permission to delete books.");
        return;
    }

    if (window.confirm(`Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`)) {
      setError(null);
      try {
        await bookApi.deleteBook(bookId);
        // Filter out the deleted book from the main list
        setAllAvailableBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        // No need to call setDisplayedBooks here, as the useEffect will re-filter
        alert(`Book "${bookTitle}" deleted successfully!`);
      } catch (err) {
        console.error("Error deleting book:", err);
        setError(err.response?.data?.message || "Could not delete book. Please try again.");
      }
    }
  };

  const handleViewDetailsClick = (book) => {
    setSelectedBookForDetails(book);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedBookForDetails(null);
  };

  // NEW: Function to handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="books-container">
      <h2 className="books-title">Available Books</h2>

      {loading && <p className="status-message">Loading books...</p>}
      {error && <p className="status-message error">{error}</p>}

      {!loading && !error && allAvailableBooks.length === 0 && (
        <p className="status-message">No books available at the moment.</p>
      )}

      {!loading && !error && allAvailableBooks.length > 0 && (
        <div className="category-filter"> {/* NEW: Category filter container */}
          {categories.map((category) => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategorySelect(category)}
            >
              {category === 'ALL' ? 'All Categories' : category.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      )}

      {!loading && !error && displayedBooks.length === 0 && selectedCategory !== 'ALL' && (
        <p className="status-message">No books available in this category.</p>
      )}
      {!loading && !error && displayedBooks.length === 0 && selectedCategory === 'ALL' && allAvailableBooks.length > 0 && (
        <p className="status-message">No books match the current filter criteria.</p>
      )}


      <div className="books-grid">
        {displayedBooks.map((book) => ( // Use displayedBooks here
          <div key={book.id} className="book-card">
            <div className="book-details">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              <p className="book-copies">
                {book.availableCopies} {book.availableCopies === 1 ? 'copy' : 'copies'} available
              </p>
            </div>
            <div className="book-actions">
              <button
                className="borrow-button"
                onClick={() => handleBorrowBook(book.id)}
                disabled={book.availableCopies === 0}
              >
                {book.availableCopies === 0 ? 'Unavailable' : 'Borrow'}
              </button>
              <button
                className="details-button"
                onClick={() => handleViewDetailsClick(book)}
              >
                Details
              </button>
              {isAdminOrLibrarian && (
                <>
                  <button
                    className="update-button"
                    onClick={() => handleUpdateClick(book)}
                  >
                    Update
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteBook(book.id, book.title)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showUpdateModal && selectedBookForUpdate && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <UpdateBookForm
              book={selectedBookForUpdate}
              onUpdateSuccess={handleUpdateSuccess}
              onCancel={handleUpdateCancel}
            />
          </div>
        </div>
      )}

      {showDetailsModal && selectedBookForDetails && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <BookDetailsModal
              book={selectedBookForDetails}
              onClose={handleCloseDetailsModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksAvailable;