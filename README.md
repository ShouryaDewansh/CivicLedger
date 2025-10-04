# 🗳️ CivicLedger

**Privacy-Preserving Verifiable Voting Using Merkle Trees and Ed25519 Signatures**

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

**Cast your vote anonymously. Verify it was counted. Trust through cryptography.**

</div>

---

## 🎯 Overview

CivicLedger is a lightweight voting platform that provides **cryptographic proof** that your vote was counted, without revealing what you voted for. It uses Merkle trees for efficient inclusion proofs and Ed25519 signatures for non-repudiation.

### The Problem

Traditional voting systems require blind trust. Voters can't independently verify their vote was counted correctly, and centralized systems expose privacy risks.

### Our Approach

1. **Hash votes client-side** (SHA-256) before transmission
2. **Build Merkle trees** from vote commitments on the server
3. **Generate inclusion proofs** for each vote
4. **Sign snapshots** with Ed25519 digital signatures
5. **Verify locally** - clients can verify receipts offline

**Result**: Privacy + Verifiability + Transparency

---

## ✨ Features

- 🔒 **Privacy-Preserving** - Server never sees vote content, only cryptographic hashes
- ✅ **Cryptographically Verifiable** - Merkle proofs provide mathematical certainty
- 🌳 **Tamper-Evident** - Any manipulation changes the Merkle root
- 📜 **Portable Receipts** - Verify your vote anytime, anywhere (offline capable)
- 🎨 **Modern Interface** - Clean, responsive UI built with React and Tailwind CSS
- ⚡ **Fast** - O(log n) proof generation and verification
- 🐳 **Deployable** - Docker support included

---

## 🏗️ Architecture

```
┌─────────────────────┐
│   React Frontend    │  SHA-256 hashing
│   (Port 8080)       │  Local verification
└──────────┬──────────┘
           │ HTTPS/JSON
┌──────────▼──────────┐
│  Express Backend    │  Merkle tree builder
│  (Port 4000)        │  Ed25519 signer
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  SQLite Database    │  Vote commitments
│                     │  Signed snapshots
└─────────────────────┘
```

**Privacy Flow:**
```
Vote Selection → SHA256(SHA256(vote)) → Server gets hash only
→ Server builds Merkle tree → Returns proof + signature
→ Client verifies locally → ✅ Verified!
```

---

## 🛠️ Tech Stack

**Backend**: Node.js 18, Express, SQLite, merkletreejs, tweetnacl  
**Frontend**: React 18, TypeScript, Vite, Tailwind CSS, crypto-js  
**Crypto**: SHA-256, Merkle Trees, Ed25519 Signatures  
**Deployment**: Docker, Railway, Vercel

---

## 🚀 Quick Start

```bash
# Clone and run
git clone https://github.com/ShouryaDewansh/CivicLedger.git
cd CivicLedger

# Backend
npm install && npm run dev
# → http://localhost:4000

# Frontend (new terminal)
cd frontend && npm install && npm run dev
# → http://localhost:8080
```

---

## 📡 API Reference

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `GET /api/server-public-key` | Ed25519 public key |
| `POST /api/polls` | Create poll |
| `GET /api/polls/:id` | Get poll + count |
| `POST /api/:pollId/vote` | Cast vote, get receipt |
| `POST /api/polls/:id/snapshot` | Create signed snapshot |
| `GET /api/polls/:id/snapshots` | List snapshots |

**Full specification**: See [`openapi.yaml`](./openapi.yaml) | **Test**: Import [`postman_collection.json`](./postman_collection.json)

---

## 🔐 How Verification Works

### Client Side (Browser)
```javascript
// User selects "Option A"
const voteData = { pollId, option: "Option A", secret, timestamp, nonce };
const commitment = JSON.stringify(voteData);
const leaf = SHA256(SHA256(commitment)); // 64-char hex

// Store locally, send hash to server
POST /api/:pollId/vote { leaf }
```

### Server Side
```javascript
// Build Merkle tree from all leaves
const tree = new MerkleTree(allLeaves, SHA256, { sortPairs: true });
const proof = tree.getProof(leaf);
const root = tree.getRoot();

// Sign snapshot
const signature = Ed25519.sign({ pollId, root, nLeaves, timestamp }, secretKey);

// Return receipt
return { leaf, proof, root, signature };
```

### Verification (Offline!)
```javascript
// Client verifies Merkle proof locally
const isValid = MerkleTree.verify(proof, leaf, root, SHA256, { sortPairs: true });
// ✅ Verified - no server needed!
```

---

## 🎓 Use Cases

- ✅ Student council elections
- ✅ Corporate board decisions
- ✅ Community polls and surveys
- ✅ Event planning and voting
- ✅ Academic research on voting systems

---

## 🐳 Docker

```bash
docker compose up -d
```

Runs complete stack (backend + frontend) with persistent database volume.

---

## 📊 Project Structure

```
CivicLedger/
├── src/                    # Backend (Express API)
│   ├── crypto/            # Merkle trees + Ed25519
│   ├── routes/            # API endpoints
│   └── services/          # IPFS support
├── frontend/              # React UI
│   ├── src/pages/         # Home, CreatePoll, PollView
│   ├── src/components/    # VoteForm, ReceiptCard
│   └── src/utils/         # Crypto, API, Storage
├── openapi.yaml           # API specification
├── docker-compose.yml     # Docker orchestration
└── README.md
```

---

## 🔬 Technical Details

**Cryptographic Primitives:**
- SHA-256 (NIST FIPS 180-4) for hashing
- Merkle Trees for O(log n) proofs
- Ed25519 (RFC 8032) for signatures
- Double hashing for commitment scheme

**Performance:**
- < 100ms vote processing
- O(log n) proof size (10 hashes for 1000 votes)
- Scales to 10,000+ votes efficiently

**Security Model:**
- Privacy: Client-side hashing
- Verifiability: Merkle inclusion proofs
- Integrity: Ed25519 signatures
- Transparency: Open source code

---

## ⚠️ Important Notes

This is a **prototype** for educational and demonstration purposes.

**Not suitable for:**
- Production elections (lacks authentication, audit)
- High-stakes voting (not professionally audited)
- Legal/binding decisions (no compliance layer)

**Best for:**
- Learning cryptographic voting systems
- Hackathon demonstrations
- Low-stakes community polls
- Academic research

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit issues and pull requests.

---

## 📄 License

MIT License - See [LICENSE](./LICENSE)

Copyright (c) 2025 Shourya Dewansh

---

## 🔗 Resources

- **GitHub**: https://github.com/ShouryaDewansh/CivicLedger
- **API Specification**: [OpenAPI 3.0](./openapi.yaml)
- **Postman Collection**: [API Tests](./postman_collection.json)

---

<div align="center">

**Made with ❤️ for transparent democracy**

*"Don't trust. Verify."* 🔐

</div>
