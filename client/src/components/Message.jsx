import React from 'react';

const Message = ({ variant, children }) => {
  const styles = {
    padding: '12px',
    margin: '12px 0',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: variant === 'error' ? 'var(--error)' : 'var(--success)',
    color: 'white',
    textAlign: 'center'
  };

  return <div style={styles}>{children}</div>;
};

export default Message;
