import React, { useState, useEffect } from 'react';
import api from '../api/api';
import Message from '../components/Message';
import Loader from '../components/Loader';

const MyBooks = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMyBooks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/transactions/my');
      setTransactions(data);
    } catch (err) {
      setError('Failed to fetch your books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const handleReturn = async (bookId) => {
    try {
      const { data } = await api.post('/transactions/return', { bookId });
      setSuccess(`Book returned successfully! ${data.transaction.fine > 0 ? `Fine paid: ₹${data.transaction.fine}` : 'No fine.'}`);
      fetchMyBooks(); // Refresh list
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book');
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="container">
      <h1>My Borrowed Books</h1>
      
      {loading && <Loader />}
      {error && <Message variant="error">{error}</Message>}
      {success && <Message variant="success">{success}</Message>}

      {!loading && transactions.length === 0 ? (
        <p>You haven't borrowed any books yet.</p>
      ) : (
        <div className="grid">
          {transactions.map(t => (
            <div key={t._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="card-title">{t.book.title}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '14px' }}>Status: <strong>{t.status.toUpperCase()}</strong></p>
                <p style={{ fontSize: '14px' }}>Due Date: {new Date(t.dueDate).toLocaleDateString()}</p>
              </div>
              
              {t.status === 'issued' && (
                <button 
                  onClick={() => handleReturn(t.book._id)}
                  className="btn btn-primary"
                >
                  Return Book
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;
