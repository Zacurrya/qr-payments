import { API_BASE } from './authService';
import { getCurrencySymbol } from '../utils/currencyUtils';

export interface QrPayloadParams {
  accountId: string;
  username: string;
  amount?: string;
  note?: string;
}

export interface ParsedQrData {
  recipientName: string;
  accountId: string;
  amount?: string;
  note?: string;
  rawPayload: string;
}

export const paymentService = {
  formatCurrency: (amount: number | string, currencyCode: string = 'USD'): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    const formattedNum = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${formattedNum}`;
  },

  generateQrPayload: ({ accountId, username, amount = '0', note = '' }: QrPayloadParams): string => {
    const cleanAmount = amount || '0';
    const cleanNote = encodeURIComponent(note);
    const cleanUser = encodeURIComponent(username);
    return `QPay://pay/${accountId}?username=${cleanUser}&amount=${cleanAmount}&note=${cleanNote}`;
  },

  processPayment: async (debtorId: string, creditorId: string, amount: string, currency: string = '', reference: string = '', idempotencyKey?: string): Promise<void> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const res = await fetch(`${API_BASE}/api/v1/payments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        debtorId,
        creditorId,
        amount: parseFloat(amount),
        currency,
        reference,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Payment failed');
    }
  },

  parseQrPayload: (qrData: string): ParsedQrData => {
    if (qrData.startsWith('QPay://')) {
      try {
        const urlParts = qrData.replace('QPay://', '').split('?');
        const path = urlParts[0]; // e.g. 'pay/ACC-1234'
        const accountId = path.replace(/^pay\//, '') || qrData;
        const queryString = urlParts[1] || '';
        const queryParams = new URLSearchParams(queryString);

        const username = queryParams.get('username') ? decodeURIComponent(queryParams.get('username')!) : 'Unknown Account';
        const amount = queryParams.get('amount') || undefined;
        const note = queryParams.get('note') ? decodeURIComponent(queryParams.get('note')!) : undefined;

        return {
          recipientName: username,
          accountId,
          amount,
          note,
          rawPayload: qrData,
        };
      } catch (err) {
        // Fallback
      }
    }

    return {
      recipientName: 'Unknown Account',
      accountId: qrData,
      rawPayload: qrData,
    };
  },
};

export default paymentService;

