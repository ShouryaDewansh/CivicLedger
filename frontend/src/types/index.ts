export interface Poll {
  id: string;
  title: string;
  options: string[];
  count?: number;
}

export interface VoteData {
  pollId: string;
  option: string;
  secret: string;
  timestamp: number;
  nonce: string;
}

export interface Receipt {
  pollId: string;
  leaf: string;
  index: number;
  proof: string[];
  root: string;
  timestamp: number;
  nLeaves: number;
  signature: string;
}

export interface Snapshot {
  id: number;
  pollId: string;
  root: string;
  cid: string | null;
  signature: string;
  created_at: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
