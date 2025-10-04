const nacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');

/**
 * Create a new Ed25519 keypair
 * @returns {{ publicKey: Uint8Array, secretKey: Uint8Array }}
 */
function createKeyPair() {
  return nacl.sign.keyPair();
}

/**
 * Create a deterministic snapshot object with stable key ordering
 * @param {string} pollId - Poll ID
 * @param {string} root - Merkle root (hex)
 * @param {number} nLeaves - Number of leaves
 * @param {number} timestamp - Timestamp in milliseconds
 * @param {string|null} cid - IPFS CID or null
 * @returns {object} - Snapshot object
 */
function createSnapshotObject(pollId, root, nLeaves, timestamp, cid) {
  // Stable key order for consistent signing
  return {
    pollId,
    root,
    nLeaves,
    timestamp,
    cid,
  };
}

/**
 * Sign a snapshot object
 * @param {object} snapshotObj - Snapshot object to sign
 * @param {Uint8Array} secretKey - Ed25519 secret key
 * @returns {string} - Base64-encoded signature
 */
function signMessage(snapshotObj, secretKey) {
  // Convert object to stable JSON string
  const message = JSON.stringify(snapshotObj);
  const messageBytes = naclUtil.decodeUTF8(message);

  // Sign the message
  const signature = nacl.sign.detached(messageBytes, secretKey);

  // Return base64-encoded signature
  return naclUtil.encodeBase64(signature);
}

/**
 * Verify a signature
 * @param {object} snapshotObj - Snapshot object that was signed
 * @param {string} signatureBase64 - Base64-encoded signature
 * @param {Uint8Array} publicKey - Ed25519 public key
 * @returns {boolean} - True if signature is valid
 */
function verifySignature(snapshotObj, signatureBase64, publicKey) {
  try {
    // Convert object to stable JSON string
    const message = JSON.stringify(snapshotObj);
    const messageBytes = naclUtil.decodeUTF8(message);

    // Decode signature
    const signature = naclUtil.decodeBase64(signatureBase64);

    // Verify signature
    return nacl.sign.detached.verify(messageBytes, signature, publicKey);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

module.exports = {
  createKeyPair,
  createSnapshotObject,
  signMessage,
  verifySignature,
};

