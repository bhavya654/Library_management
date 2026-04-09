import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book, onBorrow, userRole }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <h3 className="card-title">{book.title}</h3>
        <p style={{ color: 'var(--gray)', marginBottom: '8px' }}>by {book.author}</p>
        <div style={{ marginBottom: '12px' }}>
             <span className="badge">{book.genre}</span>
        </div>
        <p style={{ fontSize: '14px', marginBottom: '16px' }}>
          Status: {book.availableCopies > 0 ? (
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Available ({book.availableCopies}/{book.totalCopies})</span>
          ) : (
            <span style={{ color: 'var(--error)', fontWeight: 'bold' }}>Out of Stock</span>
          )}
        </p>
      </div>

      {userRole === 'admin' ? (
        <Link to="/admin" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
          Manage Inventory
        </Link>
      ) : (
        <button 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          disabled={book.availableCopies <= 0}
          onClick={() => onBorrow(book._id)}
        >
          {book.availableCopies > 0 ? 'Borrow' : 'Unavailable'}
        </button>
      )}
    </div>
  );
};

export default BookCard;
