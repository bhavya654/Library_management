import React, { useState, useEffect } from 'react';
import api from '../api/api';
import Message from '../components/Message';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', genre: '', totalCopies: 1, description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books');
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books');
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/transactions');
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions');
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/books', formData);
      setSuccess('Book added successfully!');
      setFormData({ title: '', author: '', isbn: '', genre: '', totalCopies: 1, description: '' });
      fetchBooks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        setSuccess('Book deleted');
        fetchBooks();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete book');
      }
    }
  };

  return (
    <div className="container">
      <h1 style={{ marginTop: '20px' }}>Admin Management Panel</h1>
      
      {success && <Message variant="success">{success}</Message>}
      {error && <Message variant="error">{error}</Message>}

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        {/* Add Book Form */}
        <div className="card">
          <h2>Add New Book</h2>
          <form style={{ marginTop: '16px' }} onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Title</label>
              <input className="input" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Author</label>
              <input className="input" name="author" value={formData.author} onChange={handleChange} required />
            </div>
            <div className="input-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                    <label>ISBN</label>
                    <input className="input" name="isbn" value={formData.isbn} onChange={handleChange} required />
                </div>
                <div>
                    <label>Genre</label>
                    <input className="input" name="genre" value={formData.genre} onChange={handleChange} required />
                </div>
            </div>
            <div className="input-group">
              <label>Total Copies</label>
              <input type="number" className="input" name="totalCopies" value={formData.totalCopies} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </form>
        </div>

        {/* Inventory List */}
        <div className="card">
          <h2>Inventory Overview</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '16px' }}>
            {books.length === 0 ? <p>No books in inventory.</p> : (
              books.map(book => (
                <div key={book._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                  <div>
                    <p style={{ fontWeight: 'bold' }}>{book.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--gray)' }}>{book.author} | {book.genre}</p>
                    <p style={{ fontSize: '12px' }}>Stock: {book.availableCopies}/{book.totalCopies}</p>
                  </div>
                  <button onClick={() => handleDelete(book._id)} className="btn btn-danger" style={{ alignSelf: 'center', padding: '4px 8px', fontSize: '12px' }}>Delete</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Borrowed Books Tracking */}
      <div className="card" style={{ marginTop: '24px' }}>
          <h2>Current Borrowed Books & Tracking</h2>
          <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              {transactions.filter(t => t.status === 'issued' || t.status === 'overdue').length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '20px' }}>No active borrowings at the moment.</p>
              ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                          <tr style={{ background: 'var(--gray-light)' }}>
                              <th style={{ padding: '12px' }}>Book</th>
                              <th style={{ padding: '12px' }}>Borrower</th>
                              <th style={{ padding: '12px' }}>Due Date</th>
                              <th style={{ padding: '12px' }}>Status</th>
                          </tr>
                      </thead>
                      <tbody>
                          {transactions.filter(t => t.status === 'issued' || t.status === 'overdue').map(t => (
                              <tr key={t._id} style={{ borderBottom: '1px solid #eee' }}>
                                  <td style={{ padding: '12px' }}>
                                      <p style={{ fontWeight: '500' }}>{t.book?.title}</p>
                                  </td>
                                  <td style={{ padding: '12px' }}>
                                      <p>{t.user?.name}</p>
                                      <p style={{ fontSize: '12px', color: 'var(--gray)' }}>{t.user?.email}</p>
                                  </td>
                                  <td style={{ padding: '12px' }}>
                                      {new Date(t.dueDate).toLocaleDateString()}
                                  </td>
                                  <td style={{ padding: '12px' }}>
                                      <span className="badge" style={{ 
                                          backgroundColor: t.status === 'overdue' ? 'var(--error)' : 'var(--success)',
                                          color: 'white'
                                      }}>
                                          {t.status}
                                      </span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              )}
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
