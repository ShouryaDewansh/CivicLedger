import CryptoJS from 'crypto-js';
import { MerkleTree } from 'merkletreejs';
import { VoteData, Receipt } from '@/types';

export function generateRandomSecret(): string {
  return CryptoJS.lib.WordArray.random(16).toString();
}

export function createVoteCommitment(
  pollId: string,
  option: string,
  secret?: string
): { leaf: string; voteData: VoteData } {
  const voteData: VoteData = {
    pollId,
    option,
    secret: secret || generateRandomSecret(),
    timestamp: Date.now(),
    nonce: crypto.randomUUID(),
  };

  // Create commitment
  const commitment = JSON.stringify(voteData);

  // Double hash (SHA-256 twice)
  const hash1 = CryptoJS.SHA256(commitment).toString();
  const leaf = CryptoJS.SHA256(hash1).toString();

  return { leaf, voteData };
}

export function verifyReceipt(receipt: Receipt): boolean {
  try {
    const { leaf, proof, root } = receipt;

    // Helper function to convert hex to Uint8Array (browser-compatible)
    const hexToBytes = (hex: string): Uint8Array => {
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
      }
      return bytes;
    };

    // Convert hex strings to Uint8Array (browser-compatible)
    const leafBuffer = hexToBytes(leaf);
    const rootBuffer = hexToBytes(root);

    const proofBuffers = proof.map((p) => ({
      data: hexToBytes(p),
    }));

    // SHA-256 hash function using CryptoJS
    const sha256 = (data: Uint8Array): Uint8Array => {
      // Convert Uint8Array to WordArray
      const wordArray = CryptoJS.lib.WordArray.create(Array.from(data) as any);
      const hash = CryptoJS.SHA256(wordArray).toString();
      return hexToBytes(hash);
    };

    // Verify Merkle proof
    const isValid = MerkleTree.verify(
      proofBuffers,
      leafBuffer,
      rootBuffer,
      sha256,
      { sortPairs: true }
    );

    return isValid;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}

export function truncateHash(hash: string, length: number = 8): string {
  if (hash.length <= length * 2) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}
