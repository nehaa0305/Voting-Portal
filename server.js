const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let votes = { for: 0, against: 0 };
const userVotes = {}; // Track user votes by userId

const resetPassword = 'sedsantarikshforever';

// WebSocket connection handling
wss.on('connection', (ws) => {
  // Send current votes to the new client
  ws.send(JSON.stringify(votes));

  ws.on('message', (message) => {
    const { type, userId, password } = JSON.parse(message);

    // Handle voting
    if (type === 'for' || type === 'against') {
      if (userVotes[userId]) {
        // Adjust the previous vote
        if (userVotes[userId] === 'for') {
          votes.for -= 1;
        } else if (userVotes[userId] === 'against') {
          votes.against -= 1;
        }
      }

      userVotes[userId] = type;

      // Add the new vote
      if (type === 'for') {
        votes.for += 1;
      } else if (type === 'against') {
        votes.against += 1;
      }
    }
    // Handle reset
    else if (type === 'reset' && password === resetPassword) {
      votes = { for: 0, against: 0 };
      Object.keys(userVotes).forEach((key) => delete userVotes[key]);
    }

    // Broadcast the updated votes to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(votes));
      }
    });
  });
});

// Route to serve the WebSocket on the /api/websocket path
app.get('/api/websocket', (req, res) => {
  res.status(200).send('WebSocket server is running');
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
