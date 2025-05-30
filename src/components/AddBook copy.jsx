import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';


const AddBook = () => {

 // const dispatch = useDispatch();



  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    category: 'FICTION',
    language: 'ENGLISH',
    yearPublished: '',
    description: '',
    totalCopies: 1,
    availableCopies: 1,
    shelfLocation: '',
    coverImageUrl: ''
  });
  const user = useSelector((state) => state.user); // Get user from Redux
  const token = user?.token;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };
  console.log("JWT Token:", token);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/books', book, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Book added successfully');
      setBook({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        category: 'FICTION',
        language: 'ENGLISH',
        yearPublished: '',
        description: '',
        totalCopies: 1,
        availableCopies: 1,
        shelfLocation: '',
        coverImageUrl: ''
      });
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book');
    }
  };

  return (
    <div>
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input name="title" value={book.title} onChange={handleChange} required />
        <br />
        <label>Author:</label>
        <input name="author" value={book.author} onChange={handleChange} required />
        <br />
        <label>ISBN:</label>
        <input name="isbn" value={book.isbn} onChange={handleChange} required />
        <br />
        <label>Publisher:</label>
        <input name="publisher" value={book.publisher} onChange={handleChange} />
        <br />
        <label>Category:</label>
        <select name="category" value={book.category} onChange={handleChange}>
          <option value="FICTION">Fiction</option>
          <option value="NON_FICTION">Non-Fiction</option>
          <option value="SCIENCE">Science</option>
          <option value="TECHNOLOGY">Technology</option>
          <option value="HISTORY">History</option>
        </select>
        <br />
        <label>Language:</label>
        <select name="language" value={book.language} onChange={handleChange}>
          <option value="ENGLISH">English</option>
          <option value="CHINESE">Chinese</option>
          <option value="MALAY">Malay</option>
          <option value="TAMIL">Tamil</option>
        </select>
        <br />
        <label>Year Published:</label>
        <input type="number" name="yearPublished" value={book.yearPublished} onChange={handleChange} />
        <br />
        <label>Description:</label>
        <textarea name="description" value={book.description} onChange={handleChange} />
        <br />
        <label>Total Copies:</label>
        <input type="number" name="totalCopies" value={book.totalCopies} onChange={handleChange} min="1" required />
        <br />
        <label>Available Copies:</label>
        <input type="number" name="availableCopies" value={book.availableCopies} onChange={handleChange} min="0" required />
        <br />
        <label>Shelf Location:</label>
        <input name="shelfLocation" value={book.shelfLocation} onChange={handleChange} />
        <br />
        <label>Cover Image URL:</label>
        <input name="coverImageUrl" value={book.coverImageUrl} onChange={handleChange} />

        <br /><br />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
