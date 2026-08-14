import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { ledgerService } from '../services/ledgerService';

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: string;
  isIncome: boolean;
  time: string;
  dateMarker: string;
  icon: string;
}

export function useAccount() {
  const { session } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const userFullName = session?.username ?? '';
  const balance = parseFloat(session?.balance ?? '0');
  const currency = session?.currency ?? 'USD';
  const cardNumber = session?.accountId
    ? `•••• ${session.accountId.slice(-4).toUpperCase()}`
    : '';

  const fetchTransactions = async (limit: number = 8) => {
    if (!session?.accountId) return;
    try {
      setLoadingTransactions(true);
      const data = await ledgerService.getAccountLedgers(session.accountId, limit);
      
      const mapped: Transaction[] = data.map(entry => {
        let title = entry.referenceCode;
        if (!title) {
          if (entry.counterpartyUsername) {
            title = entry.counterpartyUsername;
          } else {
            title = entry.entryType === 'CREDIT' ? 'Payment Received' : 'Payment Sent';
          }
        }

        const dateObj = new Date(entry.createdAt);

        return {
          id: entry.id,
          title: title,
          category: entry.entryType === 'CREDIT' ? 'Income' : 'Expense',
          amount: Math.abs(entry.amount).toFixed(2),
          isIncome: entry.entryType === 'CREDIT',
          time: dateObj.toLocaleTimeString(undefined, {
            hour: '2-digit', minute: '2-digit'
          }),
          dateMarker: dateObj.toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          }),
          icon: entry.entryType === 'CREDIT' ? 'arrow-down-left' : 'arrow-up-right'
        };
      });
      setTransactions(mapped);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [session?.accountId]);

  return {
    userFullName,
    balance,
    cardNumber,
    currency,
    transactions,
    fetchTransactions,
    loadingTransactions
  };
}

export default useAccount;
