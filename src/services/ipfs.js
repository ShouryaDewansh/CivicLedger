let ipfsClient = null;
let ipfsCreate = null;

// Dynamically import IPFS client only if needed
function loadIpfsClient() {
  try {
    const ipfsModule = require('ipfs-http-client');
    return ipfsModule.create;
  } catch (error) {
    console.warn('ipfs-http-client not available:', error.message);
    return null;
  }
}

/**
 * Initialize IPFS client
 * @param {string} url - IPFS API URL
 */
function initIpfs(url) {
  if (!url) {
    console.log('IPFS_URL not provided, IPFS pinning will be disabled');
    return;
  }

  try {
    ipfsCreate = loadIpfsClient();
    if (!ipfsCreate) {
      console.log('IPFS client not available, pinning disabled');
      return;
    }
    ipfsClient = ipfsCreate({ url });
    console.log(`IPFS client initialized with URL: ${url}`);
  } catch (error) {
    console.error('Failed to initialize IPFS client:', error.message);
    ipfsClient = null;
  }
}

/**
 * Pin JSON data to IPFS
 * @param {object} data - JSON data to pin
 * @returns {Promise<string|null>} - CID of pinned data, or null if IPFS not available
 */
async function pinJSON(data) {
  if (!ipfsClient) {
    return null;
  }

  try {
    const jsonString = JSON.stringify(data, null, 2);
    const result = await ipfsClient.add(jsonString);
    console.log(`Data pinned to IPFS with CID: ${result.cid.toString()}`);
    return result.cid.toString();
  } catch (error) {
    console.error('Failed to pin data to IPFS:', error.message);
    return null;
  }
}

/**
 * Check if IPFS is available
 * @returns {boolean}
 */
function isIpfsAvailable() {
  return ipfsClient !== null;
}

module.exports = {
  initIpfs,
  pinJSON,
  isIpfsAvailable,
};

