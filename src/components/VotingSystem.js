"use client";

import { useState, useEffect } from 'react';

const VotingSystem = () => {
  const [votes, setVotes] = useState({ for: 0, against: 0 });
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    // Update WebSocket URL to the Vercel deployment URL
    const ws = new WebSocket('wss://voting-portal-5pq6v1xm3-nehaa-shris-projects.vercel.app/api/websocket');

    ws.onmessage = (event) => {
      const updatedVotes = JSON.parse(event.data);
      setVotes(updatedVotes);
    };

    return () => {
      ws.close();
    };
  }, []);

  const userId = 'user-unique-id'; // Replace with an actual unique user identifier

  const handleVote = (type) => {
    if (userVote === type) {
      return; // No action if user is trying to vote the same again
    }

    // Update WebSocket URL to the Vercel deployment URL
    const ws = new WebSocket('wss://voting-portal-five.vercel.app/api/websocket');
    ws.onopen = () => {
      ws.send(JSON.stringify({ type, userId }));
      setUserVote(type);
    };
    ws.onclose = () => {
      console.log(`Connection closed after sending ${type} vote`);
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const handleReset = () => {
    const password = prompt("Enter password to reset votes:");
    if (password) {
      // Update WebSocket URL to the Vercel deployment URL
      const ws = new WebSocket('wss://voting-portal-five.vercel.app/api/websocket');
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'reset', password }));
      };
      ws.onclose = () => {
        console.log('Connection closed after sending reset vote');
      };
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
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
