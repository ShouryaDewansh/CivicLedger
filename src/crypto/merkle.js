const crypto = require('crypto');
const { MerkleTree } = require('merkletreejs');

/**
 * SHA-256 hash function
 * @param {Buffer} data - Data to hash
 * @returns {Buffer} - Hash result
 */
function sha256(data) {
  return crypto.createHash('sha256').update(data).digest();
}

/**
 * Build a Merkle tree from an array of leaf hashes (hex strings)
 * @param {string[]} leavesHex - Array of hex-encoded leaf hashes
 * @returns {{ tree: MerkleTree, root: string }} - Tree instance and root hash (hex)
 */
function buildTree(leavesHex) {
  if (!leavesHex || leavesHex.length === 0) {
    throw new Error('Cannot build tree from empty leaves array');
  }

  // Convert hex strings to buffers
  const leafBuffers = leavesHex.map((hex) => Buffer.from(hex, 'hex'));

  // Build tree with sortPairs enabled for deterministic ordering
  const tree = new MerkleTree(leafBuffers, sha256, { sortPairs: true });

  const root = tree.getRoot().toString('hex');

  return { tree, root };
}

/**
 * Get Merkle proof for a specific leaf
 * @param {MerkleTree} tree - The Merkle tree
 * @param {string} leafHex - The leaf to prove (hex)
 * @returns {string[]} - Array of proof hashes (hex)
 */
function getProof(tree, leafHex) {
  const leafBuffer = Buffer.from(leafHex, 'hex');
  const proof = tree.getProof(leafBuffer);

  // Convert proof to hex strings
  return proof.map((item) => item.data.toString('hex'));
}

/**
 * Verify a Merkle proof
 * @param {string} leafHex - The leaf to verify (hex)
 * @param {string[]} proofHex - Array of proof hashes (hex)
 * @param {string} rootHex - Expected root hash (hex)
 * @returns {boolean} - True if proof is valid
 */
function verifyProof(leafHex, proofHex, rootHex) {
  const leafBuffer = Buffer.from(leafHex, 'hex');
  const rootBuffer = Buffer.from(rootHex, 'hex');

  // Convert proof hex strings to buffers with proper structure
  const proof = proofHex.map((hex) => ({
    data: Buffer.from(hex, 'hex'),
  }));

  return MerkleTree.verify(proof, leafBuffer, rootBuffer, sha256, { sortPairs: true });
}

/**
 * Get the index of a leaf in the tree
 * @param {MerkleTree} tree - The Merkle tree
 * @param {string} leafHex - The leaf to find (hex)
 * @returns {number} - Index of the leaf, or -1 if not found
 */
function getLeafIndex(tree, leafHex) {
  const leafBuffer = Buffer.from(leafHex, 'hex');
  const leaves = tree.getLeaves();

  for (let i = 0; i < leaves.length; i++) {
    if (leaves[i].equals(leafBuffer)) {
      return i;
    }
  }

  return -1;
}

module.exports = {
  sha256,
  buildTree,
  getProof,
  verifyProof,
  getLeafIndex,
};

