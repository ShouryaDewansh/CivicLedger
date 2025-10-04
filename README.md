# CivicLedger

Privacy-preserving, verifiable voting system using Merkle trees and Ed25519 signatures.

## 🚀 Quick Start

### Backend Setup
```bash
cd CivicLedger
npm install
npm run dev
# Server runs on http://localhost:4000
```

### Frontend Setup
```bash
cd ledger-witness-hub
npm install
npm run dev
# App runs on http://localhost:8080
```

## 📊 Features

- ✅ **Privacy**: Votes hashed client-side (SHA-256)
- ✅ **Verifiable**: Merkle proofs for inclusion verification
- ✅ **Transparent**: Ed25519 signatures for non-repudiation
- ✅ **Persistent**: SQLite database with WAL mode
- ✅ **Modern UI**: React + TypeScript + Tailwind CSS

## 🏗️ Architecture

```
Browser (localhost:8080)
    ↓ React Frontend
    ↓ API Calls (Axios)
Backend API (localhost:4000)
    ↓ Express.js
    ↓ Merkle Trees + Signatures
SQLite Database
```

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/server-public-key` | GET | Get Ed25519 public key |
| `/api/polls` | POST | Create poll |
| `/api/polls/:id` | GET | Get poll details |
| `/api/:pollId/vote` | POST | Cast vote |
| `/api/polls/:id/snapshot` | POST | Create snapshot |
| `/api/polls/:id/snapshots` | GET | List snapshots |

## 🔐 How It Works

1. **Client** creates vote commitment and hashes it (SHA-256)
2. **Client** sends only the hash to the server
3. **Server** builds Merkle tree from all vote hashes
4. **Server** generates inclusion proof for the vote
5. **Server** signs snapshot (root + metadata) with Ed25519
6. **Client** receives receipt with proof and signature
7. **Client** verifies proof locally (no server needed!)

## 🛠️ Tech Stack

### Backend
- Node.js 18+ | Express.js
- SQLite (better-sqlite3)
- merkletreejs + tweetnacl
- ipfs-http-client (optional)

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- crypto-js + merkletreejs
- Axios + React Router

## 🐳 Docker Deployment

```bash
# Build and run
docker compose up -d

# Stop
docker compose down
```

## 📝 Environment Variables

Create `.env` file:
```bash
PORT=4000
DB_PATH=./civicledger.db
NODE_ENV=production
# IPFS_URL=https://ipfs.infura.io:5001/api/v0  # Optional
```

## 🧪 Testing

```bash
npm test
# 46 tests passing
```

## ⚠️ Security Disclaimer

**This is a prototype for educational/hackathon use only.**

**NOT suitable for:**
- Production elections
- High-stakes voting
- Legal/binding decisions

**Lacks:**
- Authentication
- Rate limiting
- Vote uniqueness checks
- Professional security audit

**Use for:**
- Learning cryptography
- Hackathon demos
- Low-stakes community polls

## 📚 Documentation

- **OpenAPI Spec**: `openapi.yaml`
- **Postman Collection**: `postman_collection.json`
- **Archived Docs**: `_archive/` folder

## 🎯 Verification Example

```javascript
// Client-side verification (no server needed)
import { MerkleTree } from 'merkletreejs';
import CryptoJS from 'crypto-js';

function verifyReceipt(receipt) {
  const { leaf, proof, root } = receipt;
  
  // Convert hex to bytes
  const hexToBytes = (hex) => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  };
  
  // SHA-256 hash function
  const sha256 = (data) => {
    const wordArray = CryptoJS.lib.WordArray.create(Array.from(data));
    const hash = CryptoJS.SHA256(wordArray).toString();
    return hexToBytes(hash);
  };
  
  // Verify proof
  return MerkleTree.verify(
    proof.map(p => ({ data: hexToBytes(p) })),
    hexToBytes(leaf),
    hexToBytes(root),
    sha256,
    { sortPairs: true }
  );
}
```

## 📞 Support

For issues or questions, check the archived documentation in `_archive/` folder.

## 📄 License

MIT License - See LICENSE file

---

**Made with ❤️ for transparent democracy**

*"Don't trust. Verify."* 🔐
