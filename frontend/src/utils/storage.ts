import { VoteData, Receipt } from '@/types';

const VOTE_PREFIX = 'vote_';
const RECEIPT_PREFIX = 'receipt_';
const SERVER_KEY = 'server_public_key';

export const storeVoteData = (leaf: string, voteData: VoteData): void => {
  localStorage.setItem(`${VOTE_PREFIX}${leaf}`, JSON.stringify(voteData));
};

export const getVoteData = (leaf: string): VoteData | null => {
  const data = localStorage.getItem(`${VOTE_PREFIX}${leaf}`);
  return data ? JSON.parse(data) : null;
};

export const storeReceipt = (receipt: Receipt): void => {
  localStorage.setItem(`${RECEIPT_PREFIX}${receipt.leaf}`, JSON.stringify(receipt));
};

export const getReceipt = (leaf: string): Receipt | null => {
  const data = localStorage.getItem(`${RECEIPT_PREFIX}${leaf}`);
  return data ? JSON.parse(data) : null;
};

export const getAllReceiptsForPoll = (pollId: string): Array<{ receipt: Receipt; voteData: VoteData | null }> => {
  const receipts: Array<{ receipt: Receipt; voteData: VoteData | null }> = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(RECEIPT_PREFIX)) {
      const receipt: Receipt = JSON.parse(localStorage.getItem(key)!);
      if (receipt.pollId === pollId) {
        const voteData = getVoteData(receipt.leaf);
        receipts.push({ receipt, voteData });
      }
    }
  }
  
  return receipts.sort((a, b) => b.receipt.timestamp - a.receipt.timestamp);
};

export const storeServerPublicKey = (key: string): void => {
  localStorage.setItem(SERVER_KEY, key);
};

export const getServerPublicKey = (): string | null => {
  return localStorage.getItem(SERVER_KEY);
};

export const downloadReceipt = (receipt: Receipt, voteData: VoteData | null): void => {
  const data = {
    receipt,
    voteData,
    verified: true,
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt_${receipt.leaf.slice(0, 8)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
