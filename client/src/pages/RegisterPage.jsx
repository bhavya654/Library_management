import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import Message from '../components/Message';
import Loader from '../components/Loader';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isSuccess) {
      navigate('/');
    }
  }, [user, navigate, isSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLocalLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      
      // 1. Update context (persists to localStorage)
      register(data);

      // 2. Mark success once data is saved
      setIsSuccess(true);
      
      // 3. Smooth transition to dashboard
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error('Registration Error:', err);
      // Ensure we only show actual errors and don't flicker if unmounting
      const message = err.response?.data?.message || 'Registration failed. Try again.';
      setError(message);
      setLocalLoading(false); 
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '60px' }}>
      <div className="card" style={{ transition: 'all 0.3s ease' }}>
        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
             <div style={{ color: 'var(--success)', fontSize: '48px', marginBottom: '20px' }}>✓</div>
             <h2>Account Created!</h2>
             <p style={{ color: 'var(--gray)', marginTop: '10px' }}>Welcome, {name}. Redirecting you to the dashboard...</p>
             <div style={{ marginTop: '20px' }}><Loader size="sm" /></div>
          </div>
        ) : (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Account</h2>
            <p style={{ textAlign: 'center', color: 'var(--gray)', marginBottom: '30px' }}>Join the Library Management System</p>
            
            {error && <Message variant="error">{error}</Message>}
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Full Name</label>
                <input 
                  className="input" 
                  type="text" 
                  placeholder="Enter your name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input 
                  className="input" 
                  type="email" 
                  placeholder="Enter email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input 
                  className="input" 
                  type="password" 
                  placeholder="Minimum 6 characters" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  minLength="6"
                />
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input 
                  className="input" 
                  type="password" 
                  placeholder="Re-enter password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '10px' }}
                disabled={localLoading}
              >
                {localLoading ? <Loader size="sm" /> : 'Register'}
              </button>
            </form>
            
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
