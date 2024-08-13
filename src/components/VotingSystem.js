// src/components/VotingSystem.js

'use client'; // Ensure this component is treated as a client-side component

import { useState, useEffect } from 'react';

const VotingSystem = () => {
  const [votes, setVotes] = useState({ for: 0, against: 0 });
  const [userVote, setUserVote] = useState(null);

  // Check if we're running in a browser
  const getUserId = () => {
    if (typeof window !== 'undefined') {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = 'user-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
      }
      return userId;
    }
    return null; // Handle server-side gracefully
  };

  const userId = getUserId();

  useEffect(() => {
    fetch('/api/votes')
      .then(response => response.json())
      .then(data => setVotes(data))
      .catch(error => console.error('Error fetching votes:', error));
  }, []);

  const handleVote = (type) => {
    if (userVote === type) {
      return; // No action if user is trying to vote the same again
    }

    fetch('/api/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, userId }),
    })
      .then(response => response.text())
      .then(() => {
        setUserVote(type);
        // Fetch updated votes
        fetch('/api/votes')
          .then(response => response.json())
          .then(data => setVotes(data))
          .catch(error => console.error('Error fetching votes:', error));
      })
      .catch(error => console.error('Error:', error));
  };

  const handleReset = () => {
    const password = prompt("Enter password to reset votes:");
    if (password) {
      fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'reset', password }),
      })
        .then(response => response.text())
        .then(() => {
          // Fetch updated votes
          fetch('/api/votes')
            .then(response => response.json())
            .then(data => setVotes(data))
            .catch(error => console.error('Error fetching votes:', error));
        })
        .catch(error => console.error('Error:', error));
    }
  };

  return (
    <div className="container has-text-centered">
      <h1 className="title is-2 mt-5">Vote for the Argument</h1>
      <div className="columns is-centered mt-6">
        <div className="column is-narrow">
          <button
            onClick={() => handleVote('for')}
            className={`button is-large ${userVote === 'for' ? 'is-success' : 'is-primary'} mr-4`}
            style={{ marginRight: '20px', backgroundColor: userVote === 'for' ? '#48c774' : '#7a7a7a' }}
          >
            For
          </button>
          <button
            onClick={() => handleVote('against')}
            className={`button is-large ${userVote === 'against' ? 'is-danger' : 'is-primary'}`}
            style={{ marginLeft: '20px', backgroundColor: userVote === 'against' ? '#f14668' : '#7a7a7a' }}
          >
            Against
          </button>
        </div>
      </div>
      <div className="box mt-6">
        <p className="subtitle is-4">
          <strong>{votes.for}</strong> For | <strong>{votes.against}</strong> Against
        </p>
      </div>
      <div className="box mt-6">
        <button
          onClick={handleReset}
          className="button is-warning is-large"
          style={{ backgroundColor: '#ffdd57' }}
        >
          Reset Votes
        </button>
      </div>
    </div>
  );
};

export default VotingSystem;
