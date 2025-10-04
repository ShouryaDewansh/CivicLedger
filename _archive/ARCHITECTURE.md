# CivicLedger Architecture

## System Overview

CivicLedger is a privacy-preserving, verifiable voting system that uses cryptographic commitments, Merkle trees, and digital signatures to provide transparent vote counting while maintaining voter privacy.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Web Client  │  │ Mobile Client│  │  CLI Client  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │              │
│         └─────────────────┼──────────────────┘              │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTPS/JSON
┌──────────────────────────┼──────────────────────────────────┐
│                API Layer │(Express.js)                       │
│  ┌───────────────────────▼──────────────────────┐           │
│  │              Express Router                   │           │
│  │  /health  /polls  /vote  /snapshots          │           │
│  └───┬───────────┬───────────┬──────────┬───────┘           │
│      │           │           │          │                   │
│  ┌───▼──────┐ ┌──▼──────┐ ┌─▼────────┐ ┌▼──────────┐       │
│  │ Health   │ │ Polls   │ │  Votes   │ │ Snapshots │       │
│  │ Routes   │ │ Routes  │ │  Routes  │ │  Routes   │       │
│  └──────────┘ └─────┬───┘ └────┬─────┘ └─────┬─────┘       │
└────────────────────┼──────────┼─────────────┼──────────────┘
                     │          │             │
┌────────────────────┼──────────┼─────────────┼──────────────┐
│             Service Layer     │             │               │
│  ┌─────────────┐  ┌──────────▼───────┐  ┌──▼──────────┐   │
│  │ Validation  │  │  Merkle Service  │  │ IPFS Service│   │
│  │   Utils     │  │  (Tree Building) │  │  (Optional) │   │
│  └─────────────┘  └──────────────────┘  └─────────────┘   │
│                   ┌──────────────────┐                     │
│                   │ Signature Service│                     │
│                   │  (Ed25519 Sign)  │                     │
│                   └──────────────────┘                     │
└───────────────────────────┬────────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────────┐
│                   Data Layer (SQLite)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐             │
│  │  polls   │  │  leaves  │  │  snapshots   │             │
│  └──────────┘  └──────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. API Layer (`src/server.js`)

**Responsibilities:**
- Initialize Express application
- Generate Ed25519 keypair at startup
- Mount route handlers
- Handle CORS and JSON parsing
- Error handling middleware

**Key Features:**
- Stateless request handling
- JSON-only API
- Graceful shutdown on SIGINT/SIGTERM

### 2. Database Layer (`src/db.js`)

**Technology:** SQLite with `better-sqlite3`

**Tables:**
- `polls`: Poll metadata and options
- `leaves`: Individual vote commitments
- `snapshots`: Signed Merkle roots with optional IPFS CIDs

**Features:**
- WAL mode for better concurrency
- Foreign key constraints
- Indexed queries for performance

### 3. Route Handlers

#### Health Routes (`src/routes/health.js`)
- Simple health check endpoint
- Returns server uptime

#### Poll Routes (`src/routes/polls.js`)
- Create new polls
- Retrieve poll metadata
- Create snapshots
- List snapshots

#### Vote Routes (`src/routes/votes.js`)
- Accept vote commitments
- Build Merkle tree
- Generate inclusion proofs
- Return signed receipts

### 4. Cryptography Services

#### Merkle Service (`src/crypto/merkle.js`)

**Functions:**
- `sha256(data)`: Hash function
- `buildTree(leavesHex)`: Construct Merkle tree
- `getProof(tree, leafHex)`: Generate inclusion proof
- `verifyProof(leaf, proof, root)`: Verify inclusion proof

**Algorithm:**
- Uses `merkletreejs` library
- SHA-256 hashing
- `sortPairs: true` for deterministic ordering

#### Signature Service (`src/crypto/sign.js`)

**Functions:**
- `createKeyPair()`: Generate Ed25519 keypair
- `signMessage(obj, secretKey)`: Sign snapshot object
- `verifySignature(obj, sig, publicKey)`: Verify signature

**Algorithm:**
- Ed25519 (curve25519)
- Base64 encoding for transport
- Stable JSON serialization

### 5. IPFS Service (`src/services/ipfs.js`)

**Optional Integration:**
- Pins snapshot JSON to IPFS
- Returns CID for permanent storage
- Gracefully degrades if unavailable

### 6. Validation Layer (`src/utils/validation.js`)

**Responsibilities:**
- Input validation
- Hex string verification
- Poll structure validation
- Vote commitment validation

## Data Flow

### Vote Casting Flow

```
1. Client creates vote commitment
   vote = { option: "React", nonce: "random123" }
   commitment = SHA256(JSON.stringify(vote))
   leaf = SHA256(commitment)

2. Client sends leaf to server
   POST /api/{pollId}/vote
   Body: { leaf: "a665a45..." }

3. Server inserts leaf into database
   INSERT INTO leaves (poll_id, leaf, created_at)

4. Server builds Merkle tree
   leaves = SELECT leaf FROM leaves WHERE poll_id = ? ORDER BY id
   tree = buildMerkleTree(leaves)

5. Server generates proof for new leaf
   proof = getMerkleProof(tree, leaf)
   root = tree.getRoot()

6. Server creates snapshot object
   snapshot = {
     pollId, root, nLeaves, timestamp, cid: null
   }

7. Server signs snapshot
   signature = Ed25519.sign(snapshot, serverSecretKey)

8. Server returns receipt
   {
     receipt: {
       pollId, leaf, index, proof, root,
       timestamp, nLeaves, signature
     }
   }

9. Client verifies receipt
   a. Verify Merkle proof: proof + leaf → root
   b. Verify signature: signature + snapshot → valid
```

### Snapshot Creation Flow

```
1. Admin triggers snapshot
   POST /api/polls/{id}/snapshot

2. Server fetches all leaves
   SELECT leaf FROM leaves WHERE poll_id = ? ORDER BY id

3. Server builds Merkle tree
   tree = buildMerkleTree(allLeaves)
   root = tree.getRoot()

4. Server creates snapshot object
   snapshot = {
     pollId, root, nLeaves, timestamp, cid: null
   }

5. Server attempts IPFS pinning (if enabled)
   cid = await ipfs.add(JSON.stringify(snapshot))
   snapshot.cid = cid

6. Server signs snapshot
   signature = Ed25519.sign(snapshot, serverSecretKey)

7. Server stores snapshot
   INSERT INTO snapshots (poll_id, root, cid, signature, created_at)

8. Server returns snapshot
   { pollId, root, nLeaves, timestamp, cid, signature }
```

## Security Model

### Threat Model

**What We Protect Against:**
- ✅ Vote tampering (Merkle tree detects changes)
- ✅ False inclusion claims (Merkle proofs)
- ✅ Server equivocation (Ed25519 signatures)
- ✅ Privacy invasion (only hashes stored)

**What We DON'T Protect Against:**
- ❌ Unauthorized voting (no authentication)
- ❌ Double voting (same hash can be resubmitted)
- ❌ Spam attacks (no rate limiting)
- ❌ Coercion (no receipt-freeness)
- ❌ Network attacks (no DDoS protection)

### Cryptographic Guarantees

1. **Collision Resistance**: SHA-256 makes vote forgery computationally infeasible
2. **Inclusion Proofs**: Merkle proofs are information-theoretically secure
3. **Non-repudiation**: Ed25519 signatures prevent server from denying commitments
4. **Determinism**: `sortPairs: true` ensures consistent tree construction

## Performance Considerations

### Time Complexity

- **Vote Insertion**: O(1) database insert
- **Tree Building**: O(n log n) where n = number of votes
- **Proof Generation**: O(log n)
- **Proof Verification**: O(log n)

### Space Complexity

- **Database**: O(n) for n votes
- **Merkle Tree**: O(n) leaves + O(n) internal nodes = O(n)
- **Proof Size**: O(log n) hashes

### Scalability

**Current Limitations:**
- SQLite single-writer bottleneck
- In-memory tree construction
- No caching layer

**Potential Optimizations:**
- PostgreSQL for better concurrency
- Incremental Merkle tree updates
- Redis caching for frequently accessed data
- Separate read replicas

## Testing Strategy

### Unit Tests
- Merkle tree operations
- Digital signature operations
- Validation functions

### Integration Tests
- Full API workflow
- Database operations
- Receipt verification

### Coverage Goals
- >80% line coverage
- >70% branch coverage
- All critical paths tested

## Deployment Architecture

### Local Development
```
Node.js Process
├── Express Server (port 4000)
├── SQLite Database (file)
└── In-memory keypair
```

### Docker Production
```
Docker Container
├── Node.js 18 Alpine
├── Express Server (port 4000)
├── SQLite Database (volume mount)
└── In-memory keypair
```

### Potential Cloud Architecture
```
┌─────────────┐
│ Load        │
│ Balancer    │
└──────┬──────┘
       │
   ┌───┴────┐
   │        │
┌──▼───┐ ┌──▼───┐
│ API  │ │ API  │
│ Node │ │ Node │
└──┬───┘ └──┬───┘
   │        │
   └───┬────┘
       │
┌──────▼──────┐
│ PostgreSQL  │
│  Database   │
└─────────────┘
```

## Future Enhancements

### Short Term
1. Add Redis for caching
2. Implement authentication
3. Add rate limiting
4. Improve error messages

### Medium Term
1. Support for weighted votes
2. Multi-signature snapshots
3. Incremental Merkle tree updates
4. Vote delegation

### Long Term
1. Zero-knowledge proofs for privacy
2. Threshold signatures
3. Decentralized snapshot storage
4. Byzantine fault tolerance

## References

- [Merkle Tree Paper](https://en.wikipedia.org/wiki/Merkle_tree)
- [Ed25519 Specification](https://ed25519.cr.yp.to/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

