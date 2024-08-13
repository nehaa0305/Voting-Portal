const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

let votes = { for: 0, against: 0 };
const userVotes = {}; // Track user votes by userId

const resetPassword = 'sedsantarikshforever';

// Route to get current votes
app.get('/api/votes', (req, res) => {
  res.json(votes);
});

// Route to handle voting and reset
app.post('/api/votes', (req, res) => {
  const { type, userId, password } = req.body;

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
    res.status(200).send('Vote registered');
  }
  // Handle reset
  else if (type === 'reset' && password === resetPassword) {
    votes = { for: 0, against: 0 };
    Object.keys(userVotes).forEach((key) => delete userVotes[key]);
    res.status(200).send('Votes reset');
  } else {
    res.status(400).send('Invalid request');
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
