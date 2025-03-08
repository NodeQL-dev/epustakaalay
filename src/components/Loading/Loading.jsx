import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="spinner"></div>
        <h2>E-Pustakaalay</h2>
        <p>Loading your digital library...</p>
      </div>
    </div>
  );
};

export default Loading;
