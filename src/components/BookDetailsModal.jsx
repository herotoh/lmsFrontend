import React from 'react';
import './BookDetailsModal.css'; // Create a new CSS file for this modal

const BookDetailsModal = ({ book, onClose }) => {
  if (!book) {
    return null; // Don't render if no book is provided
  }

  
  return (
    <div className="book-details-modal">
      <h2>Book Details</h2>
      <div className="detail-item">
        <strong>Title:</strong> <span>{book.title || 'N/A'}</span>
      </div>
      <div className="detail-item">
        <strong>Author:</strong> <span>{book.author || 'N/A'}</span>
      </div>
      <div className="detail-item">
        <strong>ISBN:</strong> <span>{book.isbn || 'N/A'}</span>
      </div>
      <div className="detail-item">
        <strong>Publisher:</strong> <span>{book.publisher || 'N/A'}</span>
      </div>
      <div className="detail-item">
        <strong>Category:</strong> <span>{book.category || 'N/A'}</span>
      </div>
      <div className="detail-item">
        <strong>Language:</strong> <span>{book.language || 'N/A'}</span>
      </div>
      <div className="detail-item">
        <strong>Year Published:</strong> <span>{book.yearPublished || 'N/A'}</span>
      </div>
      <div className="detail-item description-detail">
        <strong>Description:</strong> <span>{book.description || 'N/A'}</span>
      </div>
      <div className="detail-item">
        <strong>Total Copies:</strong> <span>{book.totalCopies || 0}</span>
      </div>
      <div className="detail-item">
        <strong>Available Copies:</strong> <span>{book.availableCopies || 0}</span>
      </div>
      <div className="detail-item">
        <strong>Shelf Location:</strong> <span>{book.shelfLocation || 'N/A'}</span>
      </div>
      {book.coverImageUrl && (
        <div className="detail-item cover-image-container">
          <strong>Cover Image:</strong>
          <img src={book.coverImageUrl} alt={`${book.coverImageUrl} Cover`} className="book-cover-image" />

        </div>
      )}

      <button className="close-details-button" onClick={onClose}>Close</button>
    </div>
  );
};

export default BookDetailsModal;