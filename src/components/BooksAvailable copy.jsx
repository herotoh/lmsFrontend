import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BooksAvailable = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/books/available');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h2>Books Available for Loan</h2>
      <ul>
        {books.length === 0 ? (
          <li>No books available</li>
        ) : (
          books.map(book => (
            <li key={book.id}>
              <strong>{book.title}</strong> by {book.author} — Copies available: {book.availableCopies}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default BooksAvailable;
