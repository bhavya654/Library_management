import React from 'react';

const Loader = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <div style={{ 
        width: '30px', 
        height: '30px', 
        border: '3px solid var(--gray-light)', 
        borderTop: '3px solid var(--primary)', 
        borderRadius: '50%', 
        animation: 'spin 1s linear infinite' 
      }}></div>
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>
      <span style={{ marginLeft: '10px' }}>Loading...</span>
    </div>
  );
};

export default Loader;
