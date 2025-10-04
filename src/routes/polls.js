const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const { validatePollInput, validatePollId } = require('../utils/validation');
const { buildTree } = require('../crypto/merkle');
const { createSnapshotObject, signMessage } = require('../crypto/sign');
const { pinJSON } = require('../services/ipfs');

/**
 * POST /api/polls
 * Create a new poll
 */
router.post('/', (req, res) => {
  try {
    const validation = validatePollInput(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const { id, title, options } = req.body;
    const db = getDb();

    // Check if poll already exists
    const existing = db.prepare('SELECT id FROM polls WHERE id = ?').get(id);
    if (existing) {
      return res.status(409).json({ error: 'Poll with this ID already exists' });
    }

    const optionsJson = JSON.stringify(options);
    const createdAt = Date.now();

    db.prepare('INSERT INTO polls (id, title, options_json, created_at) VALUES (?, ?, ?, ?)').run(
      id,
      title,
      optionsJson,
      createdAt
    );

    res.status(201).json({
      id,
      title,
      options,
    });
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ error: 'Failed to create poll' });
  }
});

/**
 * GET /api/polls/:id
 * Get poll details
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const validation = validatePollId(id);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const db = getDb();

    const poll = db.prepare('SELECT * FROM polls WHERE id = ?').get(id);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const count = db.prepare('SELECT COUNT(*) as count FROM leaves WHERE poll_id = ?').get(id)
      .count;

    res.json({
      id: poll.id,
      title: poll.title,
      options: JSON.parse(poll.options_json),
      count,
    });
  } catch (error) {
    console.error('Error fetching poll:', error);
    res.status(500).json({ error: 'Failed to fetch poll' });
  }
});

/**
 * POST /api/polls/:id/snapshot
 * Create and pin a snapshot
 */
router.post('/:id/snapshot', async (req, res) => {
  try {
    const { id } = req.params;

    const validation = validatePollId(id);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const db = getDb();

    // Check if poll exists
    const poll = db.prepare('SELECT id FROM polls WHERE id = ?').get(id);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Get all leaves for this poll, ordered by ID
    const leaves = db.prepare('SELECT leaf FROM leaves WHERE poll_id = ? ORDER BY id ASC').all(id);

    if (leaves.length === 0) {
      return res.status(400).json({ error: 'Cannot create snapshot: no votes cast yet' });
    }

    const leavesHex = leaves.map((row) => row.leaf);

    // Build Merkle tree
    const { root } = buildTree(leavesHex);

    const timestamp = Date.now();
    const nLeaves = leaves.length;

    // Create snapshot object
    const snapshotObj = createSnapshotObject(id, root, nLeaves, timestamp, null);

    // Try to pin to IPFS if available
    let cid = null;
    try {
      cid = await pinJSON(snapshotObj);
      if (cid) {
        snapshotObj.cid = cid;
      }
    } catch (error) {
      console.error('IPFS pinning failed, continuing without CID:', error.message);
    }

    // Sign the snapshot
    const signature = signMessage(snapshotObj, req.app.locals.serverKeyPair.secretKey);

    // Store snapshot
    db.prepare(
      'INSERT INTO snapshots (poll_id, root, cid, signature, created_at) VALUES (?, ?, ?, ?, ?)'
    ).run(id, root, cid, signature, timestamp);

    res.json({
      pollId: id,
      root,
      nLeaves,
      timestamp,
      cid,
      signature,
    });
  } catch (error) {
    console.error('Error creating snapshot:', error);
    res.status(500).json({ error: 'Failed to create snapshot' });
  }
});

/**
 * GET /api/polls/:id/snapshots
 * List all snapshots for a poll
 */
router.get('/:id/snapshots', (req, res) => {
  try {
    const { id } = req.params;

    const validation = validatePollId(id);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const db = getDb();

    // Check if poll exists
    const poll = db.prepare('SELECT id FROM polls WHERE id = ?').get(id);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const snapshots = db
      .prepare('SELECT * FROM snapshots WHERE poll_id = ? ORDER BY created_at DESC')
      .all(id);

    res.json(
      snapshots.map((snap) => ({
        id: snap.id,
        pollId: snap.poll_id,
        root: snap.root,
        cid: snap.cid,
        signature: snap.signature,
        created_at: snap.created_at,
      }))
    );
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    res.status(500).json({ error: 'Failed to fetch snapshots' });
  }
});

module.exports = router;

