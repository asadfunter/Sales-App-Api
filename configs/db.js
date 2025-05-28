// config/db.js
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

let client;
let db;

async function connectDB() {
  if (db) return db; // Return existing connection

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('✅ MongoDB connected');
    return db;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB', error);
    throw error;
  }
}

// Optional: expose client if needed
function getClient() {
  return client;
}

module.exports = {
  connectDB,
  getClient,
};
