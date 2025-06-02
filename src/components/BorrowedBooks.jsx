import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { loanApi } from '../api';
import './BorrowedBooks.css';

const BorrowedBooks = () => {
    const user = useSelector((state) => state.user);
    const [loans, setLoans] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [member, setMember] = useState(null);

    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            if (!user || !user.username) {
                setError('Please log in to view borrowed books.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await loanApi.getLoansByMemberId(user.member.id); // Assuming user object contains member info
                setLoans(data);
            } catch (err) {
                console.error('Error fetching borrowed books:', err);
                setError('Could not load borrowed books.');
            } finally {
                setLoading(false);
            }
        };

        fetchBorrowedBooks();
    }, [user]);

    if (loading) return <p>Loading borrowed books...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!user || !user.username) return <p>Please log in to view borrowed books.</p>;

    return (
        <div className="borrowed-books-container">
            <h2>My Borrowed Books</h2>
            {loans.length === 0 ? (
                <p>You have no books borrowed.</p>
            ) : (
                <ul className="borrowed-books-list">
                    {loans.map(loan => (
                        <li key={loan.id} className="borrowed-book-item">
                            <strong>{loan.book.title}</strong> by {loan.book.author} - Due Date: {loan.dueDate}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BorrowedBooks;