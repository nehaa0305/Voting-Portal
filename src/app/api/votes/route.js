// src/app/api/votes/route.js

let votes = { for: 0, against: 0 };
const userVotes = {}; // Track user votes by userId

const resetPassword = 'sedsantarikshforever';

export async function GET() {
  return new Response(JSON.stringify({ votes }), { status: 200 });
}

export async function POST(req) {
  const { type, userId, password } = await req.json();

  if (type === 'reset' && password === resetPassword) {
    votes = { for: 0, against: 0 };
    Object.keys(userVotes).forEach((key) => delete userVotes[key]);
    return new Response(JSON.stringify({ votes }), { status: 200 });
  }

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

    return new Response(JSON.stringify({ votes }), { status: 200 });
  }

  return new Response('Invalid request', { status: 400 });
}
