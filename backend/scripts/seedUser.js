/**
 * Standalone script to add a user directly to the database.
 * There is no public registration page — this is the only way to create users.
 *
 * Usage:
 *   node scripts/seedUser.js --username admin --password secret123 --name "Admin User"
 *
 * Or edit the DEFAULT_USER object below and run with no args:
 *   node scripts/seedUser.js
 */
require('dotenv').config();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../src/models/User');

const DEFAULT_USER = {
  username: 'admin',
  password: 'changeme123',
  name: 'Admin User'
};

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    parsed[key] = args[i + 1];
  }
  return parsed;
}

async function main() {
  const args = parseArgs();
  const username = args.username || DEFAULT_USER.username;
  const password = args.password || DEFAULT_USER.password;
  const name = args.name || DEFAULT_USER.name;

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set. Copy backend/.env.example to backend/.env and configure it.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({ username });
  if (existing) {
    console.error(`User "${username}" already exists. Aborting.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, passwordHash, name });

  console.log(`Created user "${user.username}" (${user.name})`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Failed to seed user:', err);
  process.exit(1);
});
