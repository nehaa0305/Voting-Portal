const WebSocket = require('ws');

let votes = { for: 0, against: 0 };
const userVotes = {}; // Track user votes by userId

const resetPassword = 'sedsantarikshforever';

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  ws.send(JSON.stringify(votes));

  ws.on('message', (message) => {
    const { type, userId, password } = JSON.parse(message);

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
    } else if (type === 'reset' && password === resetPassword) {
      votes = { for: 0, against: 0 };
      Object.keys(userVotes).forEach((key) => delete userVotes[key]);
    }

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(votes));
      }
    });
  });
});

export default function handler(req, res) {
  if (req.method === 'GET') {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
  }
  res.end();
}

function onSocketConnect(ws) {
  wss.emit('connection', ws, ws.req);
}