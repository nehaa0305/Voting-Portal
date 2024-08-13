const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
app.use(express.json());

let votes = { for: 0, against: 0 };
const userVotes = {}; // Track user votes by userId

const resetPassword = 'sedsantarikshforever';

// Route to get the current votes
app.get('/api/votes', (req, res) => {
  res.json(votes);
});

// Route to cast a vote or reset votes
app.post('/api/vote', (req, res) => {
  const { type, userId, password } = req.body;

  if (type === 'reset' && password === resetPassword) {
    votes = { for: 0, against: 0 };
    Object.keys(userVotes).forEach((key) => delete userVotes[key]);
    return res.status(200).send('Votes reset');
  }

  if (type === 'for' || type === 'against') {
    if (userVotes[userId]) {
      if (userVotes[userId] === 'for') {
        votes.for -= 1;
      } else if (userVotes[userId] === 'against') {
        votes.against -= 1;
      }
    }

    userVotes[userId] = type;

    if (type === 'for') {
      votes.for += 1;
    } else if (type === 'against') {
      votes.against += 1;
    }

    return res.status(200).send('Vote updated');
  }

  res.status(400).send('Invalid request');
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
