import { API_BASE } from './authService';

export interface LedgerEntryResponse {
  id: string;
  transactionId: string;
  accountId: string;
  amount: number;
  entryType: 'CREDIT' | 'DEBIT';
  referenceCode: string;
  createdAt: string;
  counterpartyUsername?: string;
}

export const ledgerService = {
  getAccountLedgers: async (accountId: string, limit: number = 8): Promise<LedgerEntryResponse[]> => {
    const res = await fetch(`${API_BASE}/api/v1/ledgers/account/${accountId}?limit=${limit}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Failed to fetch ledgers');
    }

    return res.json();
  },
};

export default ledgerService;
