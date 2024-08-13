"use client";

import { useState, useEffect } from 'react';

const VotingSystem = () => {
  const [votes, setVotes] = useState({ for: 0, against: 0 });
  const [userVote, setUserVote] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('wss://your-deployment-url/api/websocket');
    setWs(ws);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      const updatedVotes = JSON.parse(event.data);
      setVotes(updatedVotes);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleVote = (type) => {
    if (userVote === type) return;

    if (ws) {
      ws.send(JSON.stringify({ type, userId: 'user-unique-id' }));
      setUserVote(type);
    }
  };

  const handleReset = () => {
    const password = prompt("Enter password to reset votes:");
    if (password && ws) {
      ws.send(JSON.stringify({ type: 'reset', password }));
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
          >
            For
          </button>
          <button
            onClick={() => handleVote('against')}
            className={`button is-large ${userVote === 'against' ? 'is-danger' : 'is-primary'}`}
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
        >
          Reset Votes
        </button>
      </div>
    </div>
  );
};

export default VotingSystem;
