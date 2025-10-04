/**
 * Check if a string is a valid hexadecimal string
 * @param {string} str - String to check
 * @returns {boolean}
 */
function isHex(str) {
  if (typeof str !== 'string') {
    return false;
  }
  return /^[0-9a-fA-F]+$/.test(str);
}

/**
 * Validate poll creation input
 * @param {object} body - Request body
 * @returns {{ valid: boolean, error?: string }}
 */
function validatePollInput(body) {
  const { id, title, options } = body;

  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return { valid: false, error: 'Poll ID is required and must be a non-empty string' };
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return { valid: false, error: 'Title is required and must be a non-empty string' };
  }

  if (!Array.isArray(options) || options.length < 2) {
    return { valid: false, error: 'Options must be an array with at least 2 items' };
  }

  for (const option of options) {
    if (typeof option !== 'string' || option.trim().length === 0) {
      return { valid: false, error: 'All options must be non-empty strings' };
    }
  }

  return { valid: true };
}

/**
 * Validate vote input
 * @param {object} body - Request body
 * @returns {{ valid: boolean, error?: string }}
 */
function validateVoteInput(body) {
  const { leaf } = body;

  if (!leaf || typeof leaf !== 'string') {
    return { valid: false, error: 'Leaf is required and must be a string' };
  }

  if (!isHex(leaf)) {
    return { valid: false, error: 'Leaf must be a valid hexadecimal string' };
  }

  if (leaf.length !== 64) {
    return { valid: false, error: 'Leaf must be a 64-character hex string (SHA-256 hash)' };
  }

  return { valid: true };
}

/**
 * Validate poll ID parameter
 * @param {string} pollId - Poll ID
 * @returns {{ valid: boolean, error?: string }}
 */
function validatePollId(pollId) {
  if (!pollId || typeof pollId !== 'string' || pollId.trim().length === 0) {
    return { valid: false, error: 'Invalid poll ID' };
  }
  return { valid: true };
}

module.exports = {
  isHex,
  validatePollInput,
  validateVoteInput,
  validatePollId,
};

