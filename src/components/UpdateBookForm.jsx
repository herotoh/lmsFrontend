import React, { useState, useEffect } from 'react';
import { bookApi } from '../api'; // Use your bookApi for updates
import './AddBook.css'; // You can reuse the same CSS

const UpdateBookForm = ({ book, onUpdateSuccess, onCancel }) => {
    const [formData, setFormData] = useState(book);
    const [error, setError] = useState(null);

    useEffect(() => {
        setFormData(book); // Set form data when the 'book' prop changes
    }, [book]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);

        // Basic client-side validation
        if (!formData.title || !formData.author || !formData.isbn || formData.totalCopies < 1 || formData.availableCopies < 0) {
            setError('Title, Author, ISBN, Total Copies (min 1), and Available Copies (min 0) are required.');
            return;
        }
        if (formData.availableCopies > formData.totalCopies) {
            setError('Available copies cannot exceed total copies.');
            return;
        }

        try {
            // Call the updateBook API
            await bookApi.updateBook(formData.id, formData);
            onUpdateSuccess(); // Call the success callback passed from parent
        } catch (err) {
            console.error('Error updating book:', err.response || err);
            setError(err.response?.data?.message || 'Failed to update book.');
        }
    };

    return (
        <div className="add-book-container"> {/* Reusing the same container style */}
            <h2>Update Book Details</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <label htmlFor="author">Author:</label>
                    <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <label htmlFor="isbn">ISBN:</label>
                    <input type="text" id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <label htmlFor="publisher">Publisher:</label>
                    <input type="text" id="publisher" name="publisher" value={formData.publisher} onChange={handleChange} />
                </div>

                <div className="form-row">
                    <label htmlFor="category">Category:</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange}>
                        <option value="FICTION">Fiction</option>
                        <option value="NON_FICTION">Non-Fiction</option>
                        <option value="SCIENCE">Science</option>
                        <option value="TECHNOLOGY">Technology</option>
                        <option value="HISTORY">History</option>
                    </select>
                </div>

                <div className="form-row">
                    <label htmlFor="language">Language:</label>
                    <select id="language" name="language" value={formData.language} onChange={handleChange}>
                        <option value="ENGLISH">English</option>
                        <option value="CHINESE">Chinese</option>
                        <option value="MALAY">Malay</option>
                        <option value="TAMIL">Tamil</option>
                    </select>
                </div>

                <div className="form-row">
                    <label htmlFor="yearPublished">Year Published:</label>
                    <input type="number" id="yearPublished" name="yearPublished" value={formData.yearPublished} onChange={handleChange} />
                </div>

                <div className="form-row description-row">
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
                </div>

                <div className="form-row">
                    <label htmlFor="totalCopies">Total Copies:</label>
                    <input type="number" id="totalCopies" name="totalCopies" min="1" value={formData.totalCopies} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <label htmlFor="availableCopies">Available Copies:</label>
                    <input type="number" id="availableCopies" name="availableCopies" min="0" value={formData.availableCopies} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <label htmlFor="shelfLocation">Shelf Location:</label>
                    <input type="text" id="shelfLocation" name="shelfLocation" value={formData.shelfLocation} onChange={handleChange} />
                </div>

                <div className="form-row">
                    <label htmlFor="coverImageUrl">Cover Image URL:</label>
                    <input type="text" id="coverImageUrl" name="coverImageUrl" value={formData.coverImageUrl} onChange={handleChange} />
                </div>

                <div className="form-actions">
                    <button type="submit" className="add-book-button">Update Book</button>
                    <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateBookForm;