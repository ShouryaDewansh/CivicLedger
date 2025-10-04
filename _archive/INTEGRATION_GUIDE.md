# CivicLedger Integration Guide

## ✅ Integration Complete!

Your CivicLedger frontend is now successfully integrated with the backend.

---

## 🚀 Current Setup

### Backend
- **Location**: `/Users/shouryadewansh/Downloads/CivicLedger/`
- **Port**: 4000
- **API Base URL**: `http://localhost:4000/api`
- **Status**: ✅ Running with nodemon

### Frontend
- **Location**: `/Users/shouryadewansh/Downloads/ledger-witness-hub/`
- **Port**: 8080
- **URL**: `http://localhost:8080`
- **Status**: ✅ Running with Vite dev server

---

## 📡 API Integration

The frontend is pre-configured to connect to your backend:

```typescript
// src/utils/api.ts
const API_BASE_URL = 'http://localhost:4000/api';
```

### Available API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/server-public-key` | GET | Get Ed25519 public key |
| `/polls` | POST | Create new poll |
| `/polls/:id` | GET | Get poll details |
| `/:pollId/vote` | POST | Cast vote |
| `/polls/:id/snapshot` | POST | Create snapshot |
| `/polls/:id/snapshots` | GET | List snapshots |

---

## 🔐 Cryptography Implementation

### Client-Side Vote Hashing

```typescript
// Frontend hashes votes before sending to backend
const voteData = {
  pollId: "uuid",
  option: "selected-option",
  secret: "random-secret",
  timestamp: Date.now(),
  nonce: crypto.randomUUID()
};

const commitment = JSON.stringify(voteData);
const hash1 = SHA256(commitment);
const leaf = SHA256(hash1); // Double hash

// Send only the leaf hash to backend
POST /api/:pollId/vote { leaf: "64-char-hex" }
```

### Merkle Proof Verification

```typescript
// Frontend verifies receipts locally
function verifyReceipt(receipt) {
  const { leaf, proof, root } = receipt;
  
  return MerkleTree.verify(
    proof,
    leafBuffer,
    rootBuffer,
    sha256,
    { sortPairs: true }
  );
}
```

---

## 🎨 Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Crypto**: crypto-js + merkletreejs
- **State**: React Query + Context API
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Crypto**: merkletreejs + tweetnacl
- **IPFS**: ipfs-http-client (optional)

---

## 📱 Features Implemented

### Frontend Features
✅ **Home Page** - Landing with hero section  
✅ **Create Poll** - Form to create new polls  
✅ **Poll View** - Cast votes and see results  
✅ **Vote Form** - Radio buttons + optional secret  
✅ **Receipt Cards** - Display vote receipts  
✅ **Receipt Modal** - Full receipt details + verification  
✅ **Snapshot Cards** - Display poll snapshots  
✅ **About Page** - Explain the system  
✅ **Responsive Design** - Mobile, tablet, desktop  
✅ **Dark Mode** - Theme toggle  
✅ **Toast Notifications** - User feedback  
✅ **Loading States** - Skeleton loaders  
✅ **Error Handling** - Graceful error messages  

### Backend Features
✅ **Poll Management** - Create and retrieve polls  
✅ **Vote Processing** - Accept hashed votes  
✅ **Merkle Trees** - Build trees with SHA-256  
✅ **Inclusion Proofs** - Generate proofs for votes  
✅ **Digital Signatures** - Ed25519 signatures  
✅ **Snapshots** - Create signed snapshots  
✅ **IPFS Support** - Optional pinning  
✅ **Database** - SQLite with WAL mode  
✅ **Input Validation** - Comprehensive checks  
✅ **Error Handling** - Proper HTTP status codes  

---

## 🧪 Testing the Integration

### 1. Open the Application

```bash
# Open in your browser
open http://localhost:8080
```

### 2. Create a Poll

1. Click "Create Poll" on the home page
2. Enter poll title: "Best Programming Language"
3. Add options: JavaScript, Python, Rust, Go
4. Click "Create Poll"
5. You'll be redirected to the poll page

### 3. Cast a Vote

1. Select an option (e.g., "Rust")
2. Optionally add a secret passphrase
3. Click "Submit Vote"
4. Wait for the receipt (includes Merkle proof)
5. See "✅ Verified" status

### 4. Verify the Receipt

1. Click on the receipt card
2. Modal opens with full details
3. Client verifies the Merkle proof locally
4. See verification status

### 5. Create a Snapshot

1. Scroll to snapshots section
2. Click "Create Snapshot"
3. See the signed snapshot with root hash

### 6. Share the Poll

1. Copy the poll URL
2. Share with others
3. They can vote and verify too

---

## 🔍 Verification Flow

```
┌────────────────────────────────────────────────────────┐
│                    User Workflow                       │
└────────────────────────────────────────────────────────┘

1. User selects option in frontend
                ↓
2. Frontend hashes: SHA256(SHA256(voteData))
                ↓
3. Frontend stores voteData in localStorage
                ↓
4. Frontend sends leaf to backend API
                ↓
5. Backend inserts leaf into database
                ↓
6. Backend rebuilds Merkle tree
                ↓
7. Backend generates proof for this leaf
                ↓
8. Backend signs snapshot (root, nLeaves, timestamp)
                ↓
9. Backend returns receipt with proof + signature
                ↓
10. Frontend stores receipt in localStorage
                ↓
11. Frontend verifies Merkle proof locally
                ↓
12. Frontend shows "✅ Verified" to user
                ↓
13. User can re-verify anytime (no server needed)
```

---

## 🛠️ Development Workflow

### Start Backend
```bash
cd /Users/shouryadewansh/Downloads/CivicLedger
npm run dev
# Server runs on http://localhost:4000
```

### Start Frontend
```bash
cd /Users/shouryadewansh/Downloads/ledger-witness-hub
npm run dev
# App runs on http://localhost:8080
```

### Run Tests
```bash
# Backend tests
cd /Users/shouryadewansh/Downloads/CivicLedger
npm test

# Frontend tests (if available)
cd /Users/shouryadewansh/Downloads/ledger-witness-hub
npm test
```

---

## 📦 Project Structure

```
/Users/shouryadewansh/Downloads/
├── CivicLedger/                    # Backend
│   ├── src/
│   │   ├── server.js              # Express app
│   │   ├── db.js                  # SQLite setup
│   │   ├── routes/                # API routes
│   │   ├── crypto/                # Merkle + signatures
│   │   ├── services/              # IPFS
│   │   └── utils/                 # Validation
│   ├── package.json
│   ├── .env.example
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── openapi.yaml
│   └── README.md
│
└── ledger-witness-hub/            # Frontend
    ├── src/
    │   ├── App.tsx                # Main app
    │   ├── pages/                 # React pages
    │   │   ├── Home.tsx
    │   │   ├── CreatePoll.tsx
    │   │   ├── PollView.tsx
    │   │   └── About.tsx
    │   ├── components/            # React components
    │   │   ├── poll/
    │   │   ├── snapshot/
    │   │   ├── common/
    │   │   └── ui/                # shadcn components
    │   ├── utils/                 # Utilities
    │   │   ├── api.ts             # API calls
    │   │   ├── crypto.ts          # Hashing + verification
    │   │   ├── storage.ts         # localStorage
    │   │   └── formatting.ts      # Helpers
    │   ├── types/                 # TypeScript types
    │   └── hooks/                 # Custom hooks
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.ts
```

---

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
PORT=4000
DB_PATH=./civicledger.db
NODE_ENV=development
# IPFS_URL=https://ipfs.infura.io:5001/api/v0  # Optional
```

#### Frontend (vite.config.ts)
```typescript
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  // ... other config
});
```

### API Configuration (src/utils/api.ts)
```typescript
const API_BASE_URL = 'http://localhost:4000/api';
```

---

## 🌐 CORS Configuration

The backend is configured to accept requests from any origin (for development):

```javascript
// Backend: src/server.js
app.use(cors()); // Allows all origins
```

For production, restrict CORS:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Backend not accessible from frontend

**Error**: `Network Error` or `ECONNREFUSED`

**Solution**:
```bash
# Make sure backend is running
cd /Users/shouryadewansh/Downloads/CivicLedger
npm run dev

# Check if port 4000 is accessible
curl http://localhost:4000/api/health
```

### Issue 2: Frontend not loading

**Error**: `Failed to fetch dynamically imported module`

**Solution**:
```bash
# Clear Vite cache and restart
cd /Users/shouryadewansh/Downloads/ledger-witness-hub
rm -rf node_modules/.vite
npm run dev
```

### Issue 3: Vote verification fails

**Error**: `Proof verification failed`

**Solution**:
- Ensure you're using the same hashing algorithm (SHA-256)
- Verify `sortPairs: true` in both frontend and backend
- Check that the leaf matches exactly

### Issue 4: CORS errors

**Error**: `CORS policy blocked`

**Solution**:
```javascript
// Backend already has CORS enabled
// If issues persist, check browser console for specific CORS error
```

---

## 📊 Data Flow

### Vote Casting Flow

```
Frontend                          Backend
   │                                 │
   │  1. User selects option        │
   │                                 │
   │  2. Hash vote commitment        │
   │     leaf = SHA256(SHA256(...))  │
   │                                 │
   │  3. Store voteData locally      │
   │     localStorage.setItem(...)   │
   │                                 │
   │  4. POST /:pollId/vote          │
   │     { leaf: "hex..." }          │
   ├────────────────────────────────>│
   │                                 │
   │                                 │  5. Insert into DB
   │                                 │
   │                                 │  6. Build Merkle tree
   │                                 │
   │                                 │  7. Generate proof
   │                                 │
   │                                 │  8. Sign snapshot
   │                                 │
   │  9. Receive receipt             │
   │<────────────────────────────────┤
   │                                 │
   │  10. Verify proof locally       │
   │      MerkleTree.verify(...)     │
   │                                 │
   │  11. Store receipt              │
   │      localStorage.setItem(...)  │
   │                                 │
   │  12. Show ✅ to user            │
   │                                 │
```

---

## 🎯 Next Steps

### For Development
1. ✅ Backend running on localhost:4000
2. ✅ Frontend running on localhost:8080
3. ✅ Integration working perfectly
4. 🔄 Test all features thoroughly
5. 🔄 Add custom branding/styling
6. 🔄 Implement additional features

### For Production Deployment

#### Backend
```bash
# Build Docker image
cd /Users/shouryadewansh/Downloads/CivicLedger
docker compose up -d

# Or deploy to cloud (Heroku, Railway, Render, etc.)
```

#### Frontend
```bash
# Build for production
cd /Users/shouryadewansh/Downloads/ledger-witness-hub
npm run build

# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - GitHub Pages
# - AWS S3 + CloudFront
```

### Security Checklist for Production
- [ ] Add authentication/authorization
- [ ] Implement rate limiting
- [ ] Add CAPTCHA for vote submission
- [ ] Use HTTPS for all requests
- [ ] Restrict CORS to specific domains
- [ ] Add API key authentication
- [ ] Implement vote uniqueness checks
- [ ] Add audit logging
- [ ] Store server keypair persistently
- [ ] Add monitoring and alerting

---

## 📚 Documentation Links

### Backend Documentation
- [README.md](/Users/shouryadewansh/Downloads/CivicLedger/README.md)
- [API Documentation (OpenAPI)](/Users/shouryadewansh/Downloads/CivicLedger/openapi.yaml)
- [Postman Collection](/Users/shouryadewansh/Downloads/CivicLedger/postman_collection.json)
- [Architecture](/Users/shouryadewansh/Downloads/CivicLedger/ARCHITECTURE.md)

### Frontend Documentation
- [README.md](/Users/shouryadewansh/Downloads/ledger-witness-hub/README.md)
- Component Library: [shadcn/ui](https://ui.shadcn.com/)

---

## 🎉 Success!

Your CivicLedger application is now fully integrated and running:

- ✅ Backend API serving on port 4000
- ✅ Frontend UI serving on port 8080
- ✅ Cryptographic verification working
- ✅ Merkle trees generating proofs
- ✅ Digital signatures validating
- ✅ Complete end-to-end workflow

**Access your application at:** http://localhost:8080

Happy voting! 🗳️

