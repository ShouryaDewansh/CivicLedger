require('dotenv').config();
const express = require('express');
const cors = require('cors');
const naclUtil = require('tweetnacl-util');

const { initDatabase, closeDatabase } = require('./db');
const { createKeyPair } = require('./crypto/sign');
const { initIpfs } = require('./services/ipfs');

const healthRouter = require('./routes/health');
const pollsRouter = require('./routes/polls');
const votesRouter = require('./routes/votes');

const PORT = process.env.PORT || 4000;

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Generate Ed25519 keypair at startup (for hackathon demo)
const serverKeyPair = createKeyPair();
app.locals.serverKeyPair = serverKeyPair;

console.log('Server keypair generated');
console.log(
  `Public key: ${naclUtil.encodeBase64(serverKeyPair.publicKey).substring(0, 20)}...`
);

// Initialize database
initDatabase();

// Initialize IPFS if URL provided
const ipfsUrl = process.env.IPFS_URL;
if (ipfsUrl) {
  initIpfs(ipfsUrl);
} else {
  console.log('IPFS_URL not set, snapshots will work without IPFS pinning');
}

// Routes
app.get('/api/server-public-key', (_req, res) => {
  res.json({
    publicKey: naclUtil.encodeBase64(serverKeyPair.publicKey),
  });
});

app.use('/api/health', healthRouter);
app.use('/api/polls', pollsRouter);
app.use('/api', votesRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, closing gracefully...');
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, closing gracefully...');
  closeDatabase();
  process.exit(0);
});

// Start server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n🚀 CivicLedger API running on http://localhost:${PORT}`);
    console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
  });
}

module.exports = app;

