# CivicLedger Quick Start Guide

Get CivicLedger up and running in 5 minutes!

## Prerequisites Check

```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 8.0.0
```

## Installation

```bash
# 1. Navigate to project
cd CivicLedger

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env

# 4. Start the server
npm run dev
```

You should see:
```
🚀 CivicLedger API running on http://localhost:4000
📚 API endpoints available at http://localhost:4000/api
```

## Test the API

Open a new terminal and run these commands:

### 1. Health Check
```bash
curl http://localhost:4000/api/health
```

Expected output:
```json
{"status":"ok","uptime":5}
```

### 2. Get Server Public Key
```bash
curl http://localhost:4000/api/server-public-key
```

### 3. Create a Poll
```bash
curl -X POST http://localhost:4000/api/polls \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-poll-123",
    "title": "Favorite Color",
    "options": ["Red", "Blue", "Green"]
  }'
```

### 4. Get Poll Info
```bash
curl http://localhost:4000/api/polls/test-poll-123
```

### 5. Cast a Vote
```bash
# Vote commitment (pre-hashed)
curl -X POST http://localhost:4000/api/test-poll-123/vote \
  -H "Content-Type: application/json" \
  -d '{
    "leaf": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
  }'
```

You'll receive a receipt with Merkle proof and signature!

### 6. Create a Snapshot
```bash
curl -X POST http://localhost:4000/api/polls/test-poll-123/snapshot
```

### 7. List Snapshots
```bash
curl http://localhost:4000/api/polls/test-poll-123/snapshots
```

## Run Tests

```bash
npm test
```

All tests should pass!

## Using Docker

If you prefer Docker:

```bash
docker compose up
```

The API will be available at the same URL: `http://localhost:4000`

## Next Steps

1. **Import Postman Collection**: Import `postman_collection.json` into Postman for easy testing
2. **Read API Docs**: Check `openapi.yaml` for complete API documentation
3. **Explore the Code**: Start with `src/server.js` to understand the flow
4. **Verify Receipts**: See the README for client-side verification examples

## Common Issues

### Port Already in Use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or change the port in .env
PORT=4001
```

### Database Locked
```bash
# Remove the database file
rm civicledger.db*
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Need Help?

- Read the [README.md](README.md) for detailed documentation
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Open an issue on GitHub

Happy voting! 🗳️

