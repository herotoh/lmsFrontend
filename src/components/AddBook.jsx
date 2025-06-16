import React, { useState } from 'react';
import api from '../axiosConfig';
import './AddBook.css'; // Import the CSS file
import modernSpacesFallbackImage from '../assets/1.jpg'; // Import a fallback image

const AddBook = () => {
    const [book, setBook] = useState({
        title: '', author: '', isbn: '', publisher: '',
        category: 'FICTION', language: 'ENGLISH',
        yearPublished: '', description: '',
        totalCopies: 1, availableCopies: 1,
        shelfLocation: '', 
        coverImageUrl: 'http://localhost:5173/src/assets/1.jpg' 
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [imagePreviewError, setImagePreviewError] = useState(false);

    const remarks = {
        title: 'Title is mandatory.',
        author: 'Author is mandatory.',
        isbn: 'ISBN is mandatory & unique.',
        publisher: 'mandatory',
        category: 'Select the genre of the book.',
        language: 'mandatory',
        yearPublished: 'Between 1450 - 2100.',
        description: 'Enter a brief description of the book.',
        totalCopies: 'Total copies must be zero or more.',
        availableCopies: 'Available copies must be zero or more.',
        shelfLocation: 'Enter the location of the book on the shelves.',
        coverImageUrl: 'Enter the URL of the book\'s cover image.'
    };

    const handleChange = e => {
        const { name, value } = e.target;

        const parsedValue = ['totalCopies', 'availableCopies', 'yearPublished'].includes(name)
            ? Number(value)
            : value;

        setBook(b => ({ ...b, [name]: parsedValue }));

        if (name === 'coverImageUrl') {
            setImagePreviewError(false);
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

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
            setBook({
                title: '', author: '', isbn: '', publisher: '',
                category: 'FICTION', language: 'ENGLISH',
                yearPublished: '', description: '',
                totalCopies: 1, availableCopies: 1,
                shelfLocation: '', coverImageUrl: ''
            });
            setImagePreviewError(false);
        } catch (err) {
            console.error('Error adding book:', err.response || err);
            setError(err.response?.data?.message || 'Failed to add book.');
        }
    };

    const handleImagePreviewError = () => {
        setImagePreviewError(true);
    };

    const previewImageUrl = (book.coverImageUrl && !imagePreviewError)
        ? book.coverImageUrl
        : modernSpacesFallbackImage;

    return (
        <div className="add-book-container">
            <h2>Add New Book</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <div className="add-book-content">
                <form onSubmit={handleSubmit} className="add-book-form">
                    <div className="form-row">
                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" name="title" value={book.title} onChange={handleChange} required data-remark={remarks.title} />
                    </div>

                    <div className="form-row">
                        <label htmlFor="author">Author:</label>
                        <input type="text" id="author" name="author" value={book.author} onChange={handleChange} required data-remark={remarks.author} />
                    </div>

                    <div className="form-row">
                        <label htmlFor="isbn">ISBN:</label>
                        <input type="text" id="isbn" name="isbn" value={book.isbn} onChange={handleChange} required data-remark={remarks.isbn} />
                    </div>

                    <div className="form-row">
                        <label htmlFor="publisher">Publisher:</label>
                        <input type="text" id="publisher" name="publisher" value={book.publisher} onChange={handleChange} data-remark={remarks.publisher} />
                    </div>

                    <div className="form-row">
                        <label htmlFor="category">Category:</label>
                        <select id="category" name="category" value={book.category} onChange={handleChange} data-remark={remarks.category}>
                            <option value="FICTION">Fiction</option>
                            <option value="NON_FICTION">Non-Fiction</option>
                            <option value="SCIENCE">Science</option>
                            <option value="TECHNOLOGY">Technology</option>
                            <option value="HISTORY">History</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <label htmlFor="language">Language:</label>
                        <select id="language" name="language" value={book.language} onChange={handleChange} data-remark={remarks.language}>
                            <option value="ENGLISH">English</option>
                            <option value="CHINESE">Chinese</option>
                            <option value="MALAY">Malay</option>
                            <option value="TAMIL">Tamil</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <label htmlFor="yearPublished">Year Published:</label>
                        <input type="number" id="yearPublished" name="yearPublished" value={book.yearPublished} onChange={handleChange} data-remark={remarks.yearPublished} />
                    </div>

                    <div className="form-row description-row">
                        <label htmlFor="description">Description:</label>
                        <textarea id="description" name="description" value={book.description} onChange={handleChange} data-remark={remarks.description} />
                    </div>

                    <div className="form-row">
                        <label htmlFor="totalCopies">Total Copies:</label>
                        <input type="number" id="totalCopies" name="totalCopies" min="1" value={book.totalCopies} onChange={handleChange} required data-remark={remarks.totalCopies} />
                    </div>

                    <div className="form-row">
                        <label htmlFor="availableCopies">Available Copies:</label>
                        <input type="number" id="availableCopies" name="availableCopies" min="0" value={book.availableCopies} onChange={handleChange} required data-remark={remarks.availableCopies} />
                    </div>

                    <div className="form-row">
                        <label htmlFor="shelfLocation">Shelf Location:</label>
                        <input type="text" id="shelfLocation" name="shelfLocation" value={book.shelfLocation} onChange={handleChange} data-remark={remarks.shelfLocation} />
                    </div>

                    <div className="form-row">
                        <label htmlFor="coverImageUrl">Cover Image URL:</label>
                        <input type="text" id="coverImageUrl" name="coverImageUrl" value={book.coverImageUrl} onChange={handleChange} data-remark={remarks.coverImageUrl} />
                    </div>

                    <button type="submit" className="add-book-button">Add Book</button>
                </form>

                <div className="image-preview-column">
                    <h3>Cover Image Preview</h3>
                    {previewImageUrl ? (
                        <img
                            src={previewImageUrl}
                            alt="Book Cover Preview"
                            className="book-cover-preview"
                            onError={handleImagePreviewError}
                        />
                    ) : (
                        <p>Enter a URL to see a preview.</p>
                    )}
                    {imagePreviewError && book.coverImageUrl && (
                        <p className="image-error-message">Could not load image from URL. Displaying fallback.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddBook;
