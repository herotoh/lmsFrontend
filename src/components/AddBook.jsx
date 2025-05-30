import React, { useState } from 'react';
import api from '../axiosConfig';

const AddBook = () => {
    const [book, setBook] = useState({
        title: '', author: '', isbn: '', publisher: '',
        category: 'FICTION', language: 'ENGLISH',
        yearPublished: '', description: '',
        totalCopies: 1, availableCopies: 1,
        shelfLocation: '', coverImageUrl: ''
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = e => {
        const { name, value } = e.target;
        setBook(b => ({ ...b, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Basic client-side validation (You can expand this)
        if (!book.title || !book.author || !book.isbn || book.totalCopies < 1 || book.availableCopies < 0) {
            setError('Title, Author, ISBN, Total Copies (min 1), and Available Copies (min 0) are required.');
            return;
        }
        if (book.availableCopies > book.totalCopies) {
            setError('Available copies cannot exceed total copies.');
            return;
        }

        try {
            await api.post('/books', book);
            setSuccessMessage('Book added successfully!');
            // Reset form
            setBook({
                title: '', author: '', isbn: '', publisher: '',
                category: 'FICTION', language: 'ENGLISH',
                yearPublished: '', description: '',
                totalCopies: 1, availableCopies: 1,
                shelfLocation: '', coverImageUrl: ''
            });
        } catch (err) {
            console.error('Error adding book:', err.response || err);
            setError(err.response?.data?.message || 'Failed to add book.');
        }
    };

    return (
        <div className="add-book-container">
            <h2>Add New Book</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label><br />
                    <input type="text" id="title" name="title" value={book.title} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="author">Author:</label><br />
                    <input type="text" id="author" name="author" value={book.author} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="isbn">ISBN:</label><br />
                    <input type="text" id="isbn" name="isbn" value={book.isbn} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="publisher">Publisher:</label><br />
                    <input type="text" id="publisher" name="publisher" value={book.publisher} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category:</label><br />
                    <select id="category" name="category" value={book.category} onChange={handleChange}>
                        <option value="FICTION">Fiction</option>
                        <option value="NON_FICTION">Non-Fiction</option>
                        <option value="SCIENCE">Science</option>
                        <option value="TECHNOLOGY">Technology</option>
                        <option value="HISTORY">History</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="language">Language:</label><br />
                    <select id="language" name="language" value={book.language} onChange={handleChange}>
                        <option value="ENGLISH">English</option>
                        <option value="CHINESE">Chinese</option>
                        <option value="MALAY">Malay</option>
                        <option value="TAMIL">Tamil</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="yearPublished">Year Published:</label><br />
                    <input type="number" id="yearPublished" name="yearPublished" value={book.yearPublished} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description:</label><br />
                    <textarea id="description" name="description" value={book.description} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="totalCopies">Total Copies:</label><br />
                    <input type="number" id="totalCopies" name="totalCopies" min="1" value={book.totalCopies} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="availableCopies">Available Copies:</label><br />
                    <input type="number" id="availableCopies" name="availableCopies" min="0" value={book.availableCopies} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="shelfLocation">Shelf Location:</label><br />
                    <input type="text" id="shelfLocation" name="shelfLocation" value={book.shelfLocation} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="coverImageUrl">Cover Image URL:</label><br />
                    <input type="text" id="coverImageUrl" name="coverImageUrl" value={book.coverImageUrl} onChange={handleChange} />
                </div>

                <button type="submit" className="add-book-button">Add Book</button>
            </form>
        </div>
    );
};

export default AddBook;