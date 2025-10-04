# CivicLedger Verification Checklist

Use this checklist to verify that CivicLedger meets all acceptance criteria.

## ✅ Project Structure

- [x] `package.json` with all dependencies
- [x] `.env.example` for environment configuration
- [x] `.eslintrc.cjs` for linting
- [x] `.prettierrc` for code formatting
- [x] `jest.config.cjs` for testing
- [x] `Dockerfile` for containerization
- [x] `docker-compose.yml` for easy deployment
- [x] `openapi.yaml` API specification
- [x] `postman_collection.json` for API testing
- [x] `README.md` comprehensive documentation
- [x] Complete source code structure

## ✅ Core Functionality

### Database Schema
- [x] `polls` table (id, title, options_json, created_at)
- [x] `leaves` table (id, poll_id, leaf, created_at)
- [x] `snapshots` table (id, poll_id, root, cid, signature, created_at)

### API Endpoints

#### System Endpoints
- [x] `GET /api/health` - Returns `{ status: "ok", uptime: <sec> }`
- [x] `GET /api/server-public-key` - Returns base64 Ed25519 public key

#### Poll Endpoints
- [x] `POST /api/polls` - Create new poll
- [x] `GET /api/polls/:id` - Get poll with vote count
- [x] `POST /api/polls/:id/snapshot` - Create signed snapshot
- [x] `GET /api/polls/:id/snapshots` - List all snapshots

#### Vote Endpoints
- [x] `POST /api/:pollId/vote` - Cast vote and get receipt

### Cryptography
- [x] SHA-256 hashing using Node.js crypto
- [x] Merkle tree implementation with `merkletreejs`
- [x] Ed25519 signatures with `tweetnacl`
- [x] `sortPairs: true` for deterministic tree ordering
- [x] Proper proof generation and verification

### IPFS Integration
- [x] Optional IPFS support via `ipfs-http-client`
- [x] Graceful degradation when IPFS_URL not set
- [x] CID field properly set or null

## ✅ Acceptance Criteria Testing

Run these commands to verify all acceptance criteria:

### 1. Install Dependencies
```bash
cd CivicLedger
npm install
```

### 2. Run Tests
```bash
npm test
```

Expected: All tests pass ✓

### 3. Start Server
```bash
npm run dev
```

Expected: Server starts on port 4000 ✓

### 4. Health Check
```bash
curl http://localhost:4000/api/health
```

Expected: `{"status":"ok","uptime":...}` ✓

### 5. Get Public Key
```bash
curl http://localhost:4000/api/server-public-key
```

Expected: `{"publicKey":"..."}` (base64 string) ✓

### 6. Create Poll
```bash
curl -X POST http://localhost:4000/api/polls \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-poll",
    "title": "Test Poll",
    "options": ["A", "B"]
  }'
```

Expected: Poll created with 201 status ✓

### 7. Get Poll
```bash
curl http://localhost:4000/api/polls/test-poll
```

Expected: Poll details with `count: 0` ✓

### 8. Cast First Vote
```bash
curl -X POST http://localhost:4000/api/test-poll/vote \
  -H "Content-Type: application/json" \
  -d '{
    "leaf": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  }'
```

Expected response structure:
```json
{
  "receipt": {
    "pollId": "test-poll",
    "leaf": "aaaa...",
    "index": 0,
    "proof": [...],
    "root": "...",
    "timestamp": ...,
    "nLeaves": 1,
    "signature": "..."
  }
}
```

Verify:
- [x] `index` is 0 (first vote)
- [x] `nLeaves` is 1
- [x] `proof` is an array
- [x] `root` is 64-char hex string
- [x] `signature` is base64 string

### 9. Cast Second Vote
```bash
curl -X POST http://localhost:4000/api/test-poll/vote \
  -H "Content-Type: application/json" \
  -d '{
    "leaf": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
  }'
```

Verify:
- [x] `index` is 1 (second vote)
- [x] `nLeaves` is 2
- [x] `root` is different from first vote's root

### 10. Verify Merkle Proof

Use the verification code from README.md to verify both receipts.

Expected:
- [x] Both Merkle proofs verify to their respective roots
- [x] Proofs use `sortPairs: true`

### 11. Verify Signature

Use the verification code from README.md to verify signatures.

Expected:
- [x] Both signatures verify with server public key
- [x] Snapshot object format: `{pollId, root, nLeaves, timestamp, cid: null}`
- [x] Signatures match exact JSON structure

### 12. Create Snapshot
```bash
curl -X POST http://localhost:4000/api/polls/test-poll/snapshot
```

Expected response:
```json
{
  "pollId": "test-poll",
  "root": "...",
  "nLeaves": 2,
  "timestamp": ...,
  "cid": null,
  "signature": "..."
}
```

Verify:
- [x] `cid` is null (unless IPFS_URL is configured)
- [x] `nLeaves` equals number of votes cast
- [x] `signature` verifies

### 13. List Snapshots
```bash
curl http://localhost:4000/api/polls/test-poll/snapshots
```

Expected: Array with at least one snapshot ✓

### 14. Docker Test
```bash
docker compose up
```

Expected: Server runs on port 4000 in container ✓

## ✅ Code Quality

### Linting
```bash
npm run lint
```

Expected: No errors ✓

### Formatting
```bash
npm run format:check
```

Expected: All files formatted correctly ✓

### Test Coverage
```bash
npm test -- --coverage
```

Expected:
- [x] Lines: >80%
- [x] Functions: >80%
- [x] Branches: >70%

## ✅ Documentation

- [x] `README.md` with comprehensive overview
- [x] `QUICKSTART.md` for rapid setup
- [x] `ARCHITECTURE.md` explaining system design
- [x] `CONTRIBUTING.md` with development guidelines
- [x] `openapi.yaml` with complete API spec
- [x] `postman_collection.json` for API testing
- [x] Inline code comments (JSDoc)
- [x] Example verification code

## ✅ Additional Features

- [x] Input validation with clear error messages
- [x] CORS enabled for all origins
- [x] Graceful error handling
- [x] Database indices for performance
- [x] WAL mode for SQLite concurrency
- [x] Health checks in Dockerfile
- [x] Graceful shutdown on SIGINT/SIGTERM
- [x] Environment variable configuration
- [x] Consistent JSON responses
- [x] No PII stored (only hashes)
- [x] Security disclaimers in README

## 🎉 Final Checklist

All acceptance criteria met:
- [x] Server runs with `npm run dev` and `npm start`
- [x] All tests pass with `npm test`
- [x] Docker container runs with `docker compose up`
- [x] Health endpoint works
- [x] Public key endpoint works
- [x] Poll creation and retrieval works
- [x] Vote casting returns proper receipts
- [x] Merkle proofs verify correctly
- [x] Signatures verify correctly
- [x] Snapshots work (with/without IPFS)
- [x] All API endpoints functional
- [x] Code quality tools configured
- [x] Complete documentation provided

## Notes

### If IPFS is Not Configured
- Snapshots will have `cid: null` - this is expected and correct behavior
- System works fully without IPFS

### Running Verification
To run full verification:
```bash
# 1. Install
npm install

# 2. Test
npm test

# 3. Lint
npm run lint

# 4. Start
npm run dev

# 5. In another terminal, run API tests
curl http://localhost:4000/api/health
# ... (run all curl commands above)

# 6. Docker test
docker compose up
```

All should work flawlessly! ✅

