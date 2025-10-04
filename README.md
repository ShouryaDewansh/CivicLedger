# CivicLedger

Privacy-preserving, verifiable voting system using Merkle trees and Ed25519 signatures.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

## 🎯 Live Demo

- **Frontend**: Coming soon (Deploy to Vercel)
- **Backend API**: Coming soon (Deploy to Railway)

## 🚀 Quick Start

### Option 1: Quick Start Script
```bash
# Clone the repository
git clone https://github.com/ShouryaDewansh/CivicLedger.git
cd CivicLedger

# Start both servers
./start-fullstack.sh
```

### Option 2: Manual Setup

**Backend:**
```bash
npm install
npm run dev
# Server: http://localhost:4000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:8080
```

## 📁 Project Structure

```
CivicLedger/
├── src/                    # Backend source code
│   ├── server.js          # Express API
│   ├── routes/            # API routes
│   ├── crypto/            # Merkle trees + signatures
│   └── services/          # IPFS support
├── frontend/              # React frontend
│   ├── src/
│   │   ├── pages/         # React pages
│   │   ├── components/    # UI components
│   │   └── utils/         # Crypto + API utils
│   └── package.json
├── package.json           # Backend dependencies
├── Dockerfile             # Backend Docker image
├── docker-compose.yml     # Full stack deployment
└── README.md
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
# Build and run full stack
docker compose up -d

# Stop
docker compose down
```

## 📝 Environment Variables

**Backend `.env`:**
```bash
PORT=4000
DB_PATH=./civicledger.db
NODE_ENV=production
# IPFS_URL=https://ipfs.infura.io:5001/api/v0  # Optional
```

**Frontend:**
Update `frontend/src/utils/api.ts`:
```typescript
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
```

## ☁️ Cloud Deployment

### Backend (Railway.app)
1. Connect GitHub repository
2. Set root directory to `/`
3. Add environment variables
4. Deploy!

### Frontend (Vercel)
1. Connect GitHub repository
2. Set root directory to `/frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env: `VITE_API_BASE_URL=https://your-backend-url.com/api`
6. Deploy!

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

- **Deployment Guide**: `DEPLOYMENT.md`
- **Project Structure**: `PROJECT_STRUCTURE.md`
- **OpenAPI Spec**: `openapi.yaml`
- **Postman Collection**: `postman_collection.json`
- **Detailed Docs**: `_archive/` folder

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

## 🤝 Contributing

Contributions welcome! Please read `_archive/CONTRIBUTING.md` for guidelines.

## 📄 License

MIT License - See LICENSE file

## 🔗 Links

- **GitHub**: [https://github.com/ShouryaDewansh/CivicLedger](https://github.com/ShouryaDewansh/CivicLedger)
- **Demo**: Coming soon
- **Documentation**: See `_archive/` folder

---

**Made with ❤️ for transparent democracy**

*"Don't trust. Verify."* 🔐
