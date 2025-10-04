const express = require('express');
const router = express.Router();

const startTime = Date.now();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', (_req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);

  res.json({
    status: 'ok',
    uptime,
  });
});

module.exports = router;

