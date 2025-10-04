const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const { validateVoteInput, validatePollId } = require('../utils/validation');
const { buildTree, getProof, getLeafIndex } = require('../crypto/merkle');
const { createSnapshotObject, signMessage } = require('../crypto/sign');

/**
 * POST /api/:pollId/vote
 * Cast a vote (append leaf and return inclusion receipt)
 */
router.post('/:pollId/vote', (req, res) => {
  try {
    const { pollId } = req.params;

    const pollValidation = validatePollId(pollId);
    if (!pollValidation.valid) {
      return res.status(400).json({ error: pollValidation.error });
    }

    const voteValidation = validateVoteInput(req.body);
    if (!voteValidation.valid) {
      return res.status(400).json({ error: voteValidation.error });
    }

    const { leaf } = req.body;
    const db = getDb();

    // Check if poll exists
    const poll = db.prepare('SELECT id FROM polls WHERE id = ?').get(pollId);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const timestamp = Date.now();

    // Insert the leaf
    db.prepare('INSERT INTO leaves (poll_id, leaf, created_at) VALUES (?, ?, ?)').run(
      pollId,
      leaf,
      timestamp
    );

    // Get all leaves for this poll (ordered by ID)
    const allLeaves = db
      .prepare('SELECT leaf FROM leaves WHERE poll_id = ? ORDER BY id ASC')
      .all(pollId);

    const leavesHex = allLeaves.map((row) => row.leaf);

    // Build Merkle tree
    const { tree, root } = buildTree(leavesHex);

    // Get proof for this leaf
    const proof = getProof(tree, leaf);

    // Get index of this leaf
    const index = getLeafIndex(tree, leaf);

    const nLeaves = leavesHex.length;

    // Create snapshot object with cid: null (no IPFS pinning on vote)
    const snapshotObj = createSnapshotObject(pollId, root, nLeaves, timestamp, null);

    // Sign the snapshot
    const signature = signMessage(snapshotObj, req.app.locals.serverKeyPair.secretKey);

    // Return receipt
    res.json({
      receipt: {
        pollId,
        leaf,
        index,
        proof,
        root,
        timestamp,
        nLeaves,
        signature,
      },
    });
  } catch (error) {
    console.error('Error casting vote:', error);
    res.status(500).json({ error: 'Failed to cast vote' });
  }
});

module.exports = router;

