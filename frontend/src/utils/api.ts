import axios from 'axios';
import { Poll, Receipt, Snapshot } from '@/types';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getServerPublicKey = async () => {
  const response = await api.get('/server-public-key');
  return response.data.publicKey;
};

export const createPoll = async (poll: Poll): Promise<Poll> => {
  const response = await api.post('/polls', poll);
  return response.data;
};

export const getPoll = async (id: string): Promise<Poll> => {
  const response = await api.get(`/polls/${id}`);
  return response.data;
};

export const castVote = async (
  pollId: string,
  leaf: string
): Promise<{ receipt: Receipt }> => {
  const response = await api.post(`/${pollId}/vote`, { leaf });
  return response.data;
};

export const createSnapshot = async (pollId: string): Promise<Snapshot> => {
  const response = await api.post(`/polls/${pollId}/snapshot`);
  return response.data;
};

export const getSnapshots = async (pollId: string): Promise<Snapshot[]> => {
  const response = await api.get(`/polls/${pollId}/snapshots`);
  return response.data;
};
