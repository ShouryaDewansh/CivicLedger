# CivicLedger Frontend - Bolt.new Prompt

Copy and paste this prompt into Bolt.new, v0.dev, or similar AI frontend generators:

---

## Project Overview

Create a modern, beautiful, and functional React frontend for **CivicLedger** - a privacy-preserving, verifiable voting system. The frontend should connect to an existing Node.js/Express backend API and provide a complete user experience for creating polls, casting votes, and verifying receipts.

## Tech Stack Requirements

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with a modern, clean design
- **HTTP Client**: Axios or fetch API
- **Crypto**: Use `crypto-js` for SHA-256 hashing client-side
- **State Management**: React Context API or Zustand (lightweight)
- **Routing**: React Router v6
- **UI Components**: Headless UI or Radix UI for accessible components
- **Icons**: Lucide React or Hero Icons
- **Animations**: Framer Motion (optional but recommended)

## Design Requirements

### Visual Theme
- **Modern, trustworthy, civic-themed design**
- Primary colors: Deep blue (#1e40af), white, light gray
- Accent colors: Green (#10b981) for success, Red (#ef4444) for errors
- Clean, spacious layout with ample whitespace
- Professional typography (Inter or Roboto font)
- Glassmorphism or subtle gradients for visual appeal
- Dark mode support (optional but nice-to-have)

### UX Principles
- Clear, intuitive navigation
- Immediate feedback on all actions
- Loading states for API calls
- Toast notifications for success/error messages
- Mobile-responsive (works on phones, tablets, desktops)
- Accessibility: proper ARIA labels, keyboard navigation

## Backend API Details

**Base URL**: `http://localhost:4000/api`

### Endpoints

#### 1. Health Check
```
GET /api/health
Response: { "status": "ok", "uptime": 3600 }
```

#### 2. Get Server Public Key
```
GET /api/server-public-key
Response: { "publicKey": "base64-encoded-ed25519-key" }
```

#### 3. Create Poll
```
POST /api/polls
Headers: Content-Type: application/json
Body: {
  "id": "uuid-string",
  "title": "Poll Title",
  "options": ["Option 1", "Option 2", "Option 3"]
}
Response: { "id": "uuid", "title": "...", "options": [...] }
```

#### 4. Get Poll
```
GET /api/polls/:id
Response: {
  "id": "uuid",
  "title": "Poll Title",
  "options": ["Option 1", "Option 2"],
  "count": 42
}
```

#### 5. Cast Vote
```
POST /api/:pollId/vote
Headers: Content-Type: application/json
Body: { "leaf": "64-char-hex-string" }
Response: {
  "receipt": {
    "pollId": "uuid",
    "leaf": "hex-string",
    "index": 0,
    "proof": ["hex1", "hex2", ...],
    "root": "hex-string",
    "timestamp": 1234567890,
    "nLeaves": 10,
    "signature": "base64-string"
  }
}
```

#### 6. Create Snapshot
```
POST /api/polls/:id/snapshot
Response: {
  "pollId": "uuid",
  "root": "hex-string",
  "nLeaves": 42,
  "timestamp": 1234567890,
  "cid": "ipfs-cid-or-null",
  "signature": "base64-string"
}
```

#### 7. List Snapshots
```
GET /api/polls/:id/snapshots
Response: [
  {
    "id": 1,
    "pollId": "uuid",
    "root": "hex",
    "cid": null,
    "signature": "base64",
    "created_at": 1234567890
  }
]
```

## Pages & Features

### 1. Home Page (`/`)
**Purpose**: Landing page explaining CivicLedger

**Content**:
- Hero section with title: "CivicLedger - Privacy-Preserving Verifiable Voting"
- Tagline: "Cast your vote anonymously. Verify it was counted. Trust through cryptography."
- Three feature cards:
  - 🔒 **Privacy First**: Votes are hashed before submission
  - ✅ **Verifiable**: Get cryptographic proof your vote was counted
  - 🌳 **Transparent**: Merkle trees ensure tamper-evident records
- Call-to-action buttons:
  - "Create Poll" (navigates to /create)
  - "View Poll" (shows input to enter poll ID)
- How it works section (3-step visual):
  1. Hash your vote client-side
  2. Receive inclusion receipt with Merkle proof
  3. Verify independently anytime
- Footer with GitHub link and disclaimer

### 2. Create Poll Page (`/create`)
**Purpose**: Create a new poll

**Form Fields**:
- Poll Title (text input, required)
- Poll Options (dynamic list):
  - Minimum 2 options
  - Add/remove option buttons
  - Each option is a text input
- "Create Poll" button

**Behavior**:
- Generate UUID for poll ID client-side (use `crypto.randomUUID()`)
- Validate: title not empty, at least 2 options, all options non-empty
- POST to `/api/polls`
- On success: navigate to `/poll/:id` and show success toast
- On error: show error message

**Design**: Clean form with validation indicators

### 3. Poll View Page (`/poll/:id`)
**Purpose**: View poll details, cast votes, see results

**Layout** (Three Sections):

#### Section A: Poll Info (Top)
- Poll title (large heading)
- Total votes cast (badge)
- Poll ID (small, copyable)
- Share button (copy link to clipboard)

#### Section B: Cast Vote (Left/Center)
- "Cast Your Vote" heading
- Radio buttons or cards for each option
- Text input: "Add secret (optional)" 
  - Placeholder: "e.g., a random passphrase for extra security"
  - Helper text: "This is combined with your choice for privacy"
- "Submit Vote" button (primary, large)

**Vote Submission Flow**:
1. User selects an option
2. User optionally adds a secret
3. Client creates commitment:
   ```javascript
   const voteData = {
     pollId: pollId,
     option: selectedOption,
     secret: secret || generateRandomString(),
     timestamp: Date.now()
   };
   const commitment = JSON.stringify(voteData);
   const leaf = SHA256(SHA256(commitment)).toString(); // Double hash
   ```
4. Store `voteData` in localStorage (keyed by leaf)
5. POST to `/api/:pollId/vote` with `{ leaf: leaf }`
6. Show loading spinner during request
7. On success:
   - Store receipt in localStorage
   - Show success modal with receipt details
   - Update vote count
   - Show "View Receipt" button

#### Section C: Results/Receipts (Right)
- "Your Votes" section:
  - List all receipts for this poll from localStorage
  - Each receipt shows:
    - Your choice (from stored voteData)
    - Index in tree
    - Timestamp (formatted)
    - "Verify" button
    - "View Details" button
- "Poll Snapshots" section:
  - List of official snapshots
  - Each shows: timestamp, # of votes, "View Snapshot" button

### 4. Receipt Details Modal/Page
**Purpose**: Show full receipt and verification status

**Content**:
- Receipt ID/Index
- Your vote (from localStorage)
- Merkle Proof (collapsible, show hex hashes)
- Root hash
- Signature
- Timestamp
- Verification Status:
  - ✅ "Proof Verified" or ❌ "Proof Failed"
  - Explanation of what was verified
- "Download Receipt" button (JSON file)
- "Verify Again" button

**Verification Logic** (Client-Side):
```javascript
// Use merkletreejs library in browser
import { MerkleTree } from 'merkletreejs';
import CryptoJS from 'crypto-js';

function verifyReceipt(receipt) {
  const { leaf, proof, root } = receipt;
  
  // Reconstruct tree verification
  const leafBuffer = Buffer.from(leaf, 'hex');
  const rootBuffer = Buffer.from(root, 'hex');
  
  const proofBuffers = proof.map(p => ({
    data: Buffer.from(p, 'hex')
  }));
  
  const sha256 = (data) => {
    return Buffer.from(
      CryptoJS.SHA256(
        CryptoJS.lib.WordArray.create(data)
      ).toString(),
      'hex'
    );
  };
  
  const isValid = MerkleTree.verify(
    proofBuffers,
    leafBuffer,
    rootBuffer,
    sha256,
    { sortPairs: true }
  );
  
  return isValid;
}
```

### 5. Snapshots Page (`/poll/:id/snapshots`)
**Purpose**: View all official snapshots

**Content**:
- List of snapshots (cards or table)
- Each snapshot shows:
  - Snapshot ID
  - Timestamp (formatted)
  - Number of votes
  - Root hash (truncated, copyable)
  - IPFS CID (if available, with link)
  - Signature (truncated, copyable)
  - "Verify Signature" button
- Admin action (not protected in this version):
  - "Create New Snapshot" button
  - Only show if user wants to trigger a snapshot

### 6. Admin Dashboard (`/admin`) (Optional)
**Purpose**: Admin actions

**Features**:
- Create new polls
- View all polls (list)
- Create snapshots for any poll
- View system health
- Not password-protected (hackathon version)

### 7. About/How It Works Page (`/about`)
**Purpose**: Explain the cryptography

**Content**:
- What is a Merkle tree? (visual diagram)
- How voting works (step-by-step with illustrations)
- What is an inclusion proof? (interactive demo)
- Security considerations
- Limitations disclaimer
- FAQ section

## Components to Build

### Core Components

#### 1. `PollCard`
- Props: `poll` object
- Shows: title, vote count, "View" button
- Click navigates to poll page

#### 2. `VoteForm`
- Props: `pollId`, `options`, `onVoteSuccess`
- Handles vote submission flow
- Shows loading/error states

#### 3. `ReceiptCard`
- Props: `receipt`, `voteData`
- Shows receipt summary
- "Verify" and "Details" buttons
- Verification status badge

#### 4. `ReceiptModal`
- Props: `receipt`, `voteData`, `isOpen`, `onClose`
- Full receipt details
- Verification UI
- Download option

#### 5. `SnapshotCard`
- Props: `snapshot`
- Shows snapshot details
- Copyable hashes
- IPFS link if available

#### 6. `MerkleTreeVisualizer` (Bonus)
- Props: `receipt`
- Visual representation of Merkle proof
- Shows leaf → path → root
- Interactive/animated

#### 7. `Toast` / `Notification`
- Success/error notifications
- Auto-dismiss
- Accessible

#### 8. `LoadingSpinner`
- Consistent loading indicator

#### 9. `Header`
- Navigation: Home, Create, About
- Logo
- API status indicator (green dot if healthy)

#### 10. `Footer`
- Links: GitHub, Documentation
- Disclaimer: "Educational prototype - not for production elections"

## State Management

### Global State (Context or Store)
```typescript
interface AppState {
  // API
  apiBaseUrl: string;
  serverPublicKey: string | null;
  
  // User data
  receipts: Record<string, Receipt[]>; // keyed by pollId
  voteData: Record<string, VoteData>; // keyed by leaf
  
  // UI
  isLoading: boolean;
  error: string | null;
}
```

### LocalStorage Schema
```javascript
// Store vote commitments
localStorage.setItem(`vote_${leaf}`, JSON.stringify(voteData));

// Store receipts
localStorage.setItem(`receipt_${leaf}`, JSON.stringify(receipt));

// Store server public key (cache)
localStorage.setItem('server_public_key', publicKey);
```

## Crypto Implementation

### Client-Side Hashing
```javascript
import CryptoJS from 'crypto-js';

function createVoteCommitment(pollId, option, secret) {
  const voteData = {
    pollId,
    option,
    secret: secret || generateRandomSecret(),
    timestamp: Date.now(),
    nonce: crypto.randomUUID()
  };
  
  // Create commitment
  const commitment = JSON.stringify(voteData);
  
  // Double hash (SHA-256 twice)
  const hash1 = CryptoJS.SHA256(commitment).toString();
  const leaf = CryptoJS.SHA256(hash1).toString();
  
  return { leaf, voteData };
}

function generateRandomSecret() {
  return CryptoJS.lib.WordArray.random(16).toString();
}
```

### Verification (use merkletreejs)
Install: `npm install merkletreejs crypto-js`

Implement the verification function as shown above in Receipt Details.

## Error Handling

### API Errors
- Network errors: "Unable to connect to server. Is it running?"
- 404: "Poll not found"
- 400: "Invalid input: [specific error]"
- 500: "Server error. Please try again."

### Validation Errors
- Empty fields: "This field is required"
- Invalid format: "Invalid poll ID format"
- Minimum options: "Add at least 2 options"

### User Feedback
- Success: Green toast, checkmark icon
- Error: Red toast, error icon
- Loading: Spinner with "Processing..." text

## Accessibility

- All buttons have descriptive labels
- Form inputs have associated labels
- ARIA roles for modals
- Keyboard navigation support
- Focus management (trap focus in modals)
- High contrast mode support
- Screen reader announcements for dynamic content

## Responsive Design

### Breakpoints
- Mobile: < 640px (single column)
- Tablet: 640px - 1024px (2 columns)
- Desktop: > 1024px (3 columns or sidebar layout)

### Mobile Considerations
- Hamburger menu for navigation
- Stack poll view sections vertically
- Touch-friendly button sizes (min 44px)
- Swipeable modals

## Security Considerations

### Client-Side
- Never send actual vote content to server
- Always hash votes before submission
- Store sensitive data only in localStorage (never in URL)
- Validate all user inputs
- Sanitize any rendered user content

### Disclaimers
- Show prominent disclaimer: "This is a demo/hackathon project"
- Not for production elections
- No authentication = anyone can vote multiple times

## Example User Flow

1. User lands on homepage
2. Clicks "Create Poll"
3. Enters title: "Best Pizza Topping"
4. Adds options: "Pepperoni", "Mushrooms", "Pineapple"
5. Clicks "Create Poll"
6. Redirected to poll page with shareable link
7. User selects "Pepperoni"
8. (Optional) Adds secret: "my-secret-phrase"
9. Clicks "Submit Vote"
10. System:
    - Hashes vote commitment
    - Sends leaf to API
    - Receives receipt
    - Stores in localStorage
11. Success modal appears with receipt
12. User clicks "Verify Receipt"
13. Client verifies Merkle proof locally
14. Shows "✅ Verified - Your vote is in the tree!"
15. User can share poll link with friends

## Additional Features (Nice-to-Have)

### QR Code Sharing
- Generate QR code for poll URL
- Modal with QR code for easy mobile sharing

### Receipt Export
- Download as JSON
- Download as PDF (with visual proof)
- Share receipt (generates shareable verification link)

### Statistics
- Vote distribution chart (bar chart or pie chart)
- Votes over time (if timestamps available)
- Use Chart.js or Recharts

### Proof Visualization
- Animated visualization of Merkle proof verification
- Show each step: leaf → hash with sibling → hash → ... → root
- Use Framer Motion or React Spring

### Real-time Updates
- Poll votes via polling or WebSockets
- Live vote count updates
- "X people are viewing this poll" indicator

### Browser Extension Integration
- Detect if user has MetaMask or similar
- Option to sign votes with Ethereum wallet (for future enhancement)

## File Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Toast.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Header.tsx
│   ├── poll/
│   │   ├── PollCard.tsx
│   │   ├── VoteForm.tsx
│   │   ├── ReceiptCard.tsx
│   │   └── ReceiptModal.tsx
│   ├── snapshot/
│   │   ├── SnapshotCard.tsx
│   │   └── SnapshotList.tsx
│   └── visualization/
│       └── MerkleTreeVisualizer.tsx
├── pages/
│   ├── Home.tsx
│   ├── CreatePoll.tsx
│   ├── PollView.tsx
│   ├── Snapshots.tsx
│   └── About.tsx
├── utils/
│   ├── crypto.ts (hashing, verification)
│   ├── api.ts (API calls)
│   ├── storage.ts (localStorage helpers)
│   └── formatting.ts (date, truncate hashes)
├── context/
│   └── AppContext.tsx
├── hooks/
│   ├── usePoll.ts
│   ├── useReceipts.ts
│   └── useVerification.ts
├── types/
│   └── index.ts (TypeScript interfaces)
├── App.tsx
└── main.tsx
```

## TypeScript Interfaces

```typescript
interface Poll {
  id: string;
  title: string;
  options: string[];
  count?: number;
}

interface VoteData {
  pollId: string;
  option: string;
  secret: string;
  timestamp: number;
  nonce: string;
}

interface Receipt {
  pollId: string;
  leaf: string;
  index: number;
  proof: string[];
  root: string;
  timestamp: number;
  nLeaves: number;
  signature: string;
}

interface Snapshot {
  id: number;
  pollId: string;
  root: string;
  cid: string | null;
  signature: string;
  created_at: number;
}
```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## Testing Checklist

Before considering it complete, test:
- ✅ Create a poll with 3 options
- ✅ Cast a vote and receive receipt
- ✅ Verify receipt shows correct verification status
- ✅ Cast second vote, verify proof is different
- ✅ Create snapshot
- ✅ View snapshots list
- ✅ Copy poll link and open in new tab
- ✅ Verify on mobile device
- ✅ Test error cases (invalid poll ID, network error)
- ✅ Refresh page - receipts should persist

## Final Notes

- Make it beautiful! This is about trust and transparency
- Use smooth animations for state transitions
- Provide clear educational content (many users won't understand Merkle trees)
- Include helpful tooltips and info icons
- Make cryptographic verification visible and understandable
- Celebrate successful verification (confetti animation?)

Build a modern, trustworthy, and educational interface that makes complex cryptography accessible to regular users!

---

## Quick Start Prompt (Condensed Version)

If the above is too long, use this shorter version:

**"Create a React + TypeScript + Tailwind CSS frontend for CivicLedger voting system. Include: (1) Home page with hero section, (2) Create poll form (title + dynamic options), (3) Poll view page with vote form (radio buttons + optional secret field), (4) Receipt modal showing Merkle proof verification, (5) Snapshots list. Use crypto-js for SHA-256 hashing client-side. Backend API at localhost:4000/api with endpoints: GET /health, GET /server-public-key, POST /polls, GET /polls/:id, POST /:pollId/vote (body: {leaf: hex}), GET /polls/:id/snapshots. Vote flow: user selects option → hash vote commitment → send leaf to API → receive receipt with Merkle proof → verify proof client-side using merkletreejs → show verification status. Store receipts in localStorage. Modern, clean design with blue/green theme. Mobile responsive. Include toast notifications and loading states."**

