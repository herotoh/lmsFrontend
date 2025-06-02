import React, { useEffect, useState } from 'react';
import { bookApi } from '../api'; // Import bookApi
import './BooksAvailable.css'; // Import the CSS file

const BooksAvailable = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAvailableBooks = async () => {
            try {
                setLoading(true);
                const data = await bookApi.getAvailableBooks();
                console.log('\nAPI Response Data:', data); // Log the response
                console.log('\n \n '); // Log the response
                setBooks(data);
            } catch (err) {
                console.error('Error fetching available books:', err);
                setError('Could not load books.');
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableBooks();
    }, []);

    if (loading) return <p>Loading books...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="books-available-container">
            <h2>Available Books</h2>
            {books.length === 0 ? (
                <p>No books available at the moment.</p>
            ) : (
                <ul className="books-list">
                    {books.map(book => (
                        <li key={book.id} className="book-item">
                            <strong>{book.title}</strong> by {book.author} ({book.availableCopies} copies available)
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BooksAvailable;