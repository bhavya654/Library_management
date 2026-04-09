import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
        <div className="navbar-title">Library System</div>
      </Link>
      
      <div className="navbar-links" style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/" style={{ marginRight: '10px' }}>Dashboard</Link>
            
            {/* User specific link */}
            {user.role === 'user' && (
              <Link to="/my-books" style={{ marginRight: '10px' }}>My Books</Link>
            )}
            
            {/* Admin specific link */}
            {user.role === 'admin' && (
              <Link to="/admin" style={{ marginRight: '10px', color: '#fbbf24', fontWeight: 'bold' }}>Admin Panel</Link>
            )}

            <div style={{ marginLeft: '10px', borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '10px' }}>
              <span style={{ fontSize: '13px', marginRight: '10px' }}>{user.name} ({user.role})</span>
              <button 
                onClick={handleLogout} 
                className="btn btn-danger" 
                style={{ padding: '4px 8px', fontSize: '12px' }}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
