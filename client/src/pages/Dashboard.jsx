import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import BookCard from '../components/BookCard';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  
  const { user } = useContext(AuthContext);

  const fetchBooks = async (searchKeyword = '', genre = '') => {
    setLoading(true);
    setError('');
    try {
      let url = `/books?keyword=${searchKeyword}`;
      if (genre) url += `&genre=${genre}`;
      const { data } = await api.get(url);
      setBooks(data);
    } catch (err) {
      setError('Failed to fetch books. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(keyword, selectedGenre);
  }, [selectedGenre]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(keyword, selectedGenre);
  };

  const handleBorrow = async (bookId) => {
    try {
      await api.post('/transactions/borrow', { bookId });
      setSuccess('Book borrowed successfully! Track it in "My Books".');
      fetchBooks(keyword, selectedGenre); // Refresh list
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to borrow book');
      setTimeout(() => setError(''), 5000);
    }
  };

  // Extract unique genres for the filter chips
  const genres = ['All', 'Classic', 'Technical', 'Fiction', 'Fantasy', 'Non-Fiction'];

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
         <h1>Library Dashboard</h1>
         <span style={{ fontSize: '14px', color: 'var(--gray)' }}>Role: <strong>{user?.role}</strong></span>
      </div>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginTop: '16px', marginBottom: '16px' }}>
        <input 
          type="text" 
          className="input" 
          placeholder="Search by title, author, or genre..." 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {/* Genre Filter Chips */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
           {genres.map(g => (
               <button 
                key={g} 
                className={`chip ${selectedGenre === (g === 'All' ? '' : g) ? 'active' : ''}`}
                onClick={() => setSelectedGenre(g === 'All' ? '' : g)}
               >
                   {g}
               </button>
           ))}
      </div>

      {success && <Message variant="success">{success}</Message>}
      {error && <Message variant="error">{error}</Message>}

      {loading ? (
        <Loader />
      ) : books.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <p>No books found for your search.</p>
            <button className="btn" onClick={() => {setKeyword(''); setSelectedGenre(''); fetchBooks('', '');}} style={{ marginTop: '10px' }}>Reset Filters</button>
        </div>
      ) : (
        <div className="grid grid-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {books.map(book => (
            <BookCard 
                key={book._id} 
                book={book} 
                onBorrow={handleBorrow} 
                userRole={user?.role}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
