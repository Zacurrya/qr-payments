import { useState } from 'react';
import paymentService from '../services/paymentService';
import { useAuth } from './useAuth';

export function useReceiveMoney() {
  const { session } = useAuth();
  const [requestedAmount, setRequestedAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const qrPayload = paymentService.generateQrPayload({
    accountId: session?.accountId || '',
    username: session?.username || '',
    amount: requestedAmount,
    note: note,
  });

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return {
    username: session?.username || 'User',
    requestedAmount,
    setRequestedAmount,
    note,
    setNote,
    copied,
    qrPayload,
    handleCopy,
  };
}

export default useReceiveMoney;

