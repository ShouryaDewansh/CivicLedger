const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'civicledger.db');

let db;

/**
 * Initialize the database connection and create tables if they don't exist
 */
function initDatabase() {
  db = new Database(DB_PATH, { verbose: process.env.NODE_ENV === 'development' ? console.log : null });

  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS polls (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      options_json TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS leaves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id TEXT NOT NULL,
      leaf TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (poll_id) REFERENCES polls(id)
    );

    CREATE INDEX IF NOT EXISTS idx_leaves_poll_id ON leaves(poll_id);
    CREATE INDEX IF NOT EXISTS idx_leaves_created_at ON leaves(created_at);

    CREATE TABLE IF NOT EXISTS snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id TEXT NOT NULL,
      root TEXT NOT NULL,
      cid TEXT,
      signature TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (poll_id) REFERENCES polls(id)
    );

    CREATE INDEX IF NOT EXISTS idx_snapshots_poll_id ON snapshots(poll_id);
  `);

  console.log(`Database initialized at ${DB_PATH}`);
  return db;
}

/**
 * Get the database instance
 */
function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Close the database connection
 */
function closeDatabase() {
  if (db) {
    db.close();
    console.log('Database connection closed');
  }
}

module.exports = {
  initDatabase,
  getDb,
  closeDatabase,
};

