import { useState } from 'react';
import paymentService from '../services/paymentService';

export type ScreenType = 'home' | 'send' | 'transfer' | 'receive' | 'login' | 'signup' | 'all_transactions';

export interface RecipientInfo {
  recipientName: string;
  accountId: string;
  qrValue: string;
  amount?: string;
}

export function useNavigationFlow() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [recipient, setRecipient] = useState<RecipientInfo>({
    recipientName: '',
    accountId: '',
    qrValue: '',
  });

  const handleScanSuccess = (data: { recipientName?: string; accountId?: string; qrValue: string }) => {
    const parsed = paymentService.parseQrPayload(data.qrValue);
    setRecipient({
      recipientName: data.recipientName || parsed.recipientName,
      accountId: data.accountId || parsed.accountId,
      qrValue: data.qrValue,
      amount: parsed.amount,
    });
    setCurrentScreen('transfer');
  };

  return {
    currentScreen,
    recipient,
    navigateToHome: () => setCurrentScreen('home'),
    navigateToSend: () => setCurrentScreen('send'),
    navigateToTransfer: () => setCurrentScreen('transfer'),
    navigateToReceive: () => setCurrentScreen('receive'),
    navigateToLogin: () => setCurrentScreen('login'),
    navigateToSignUp: () => setCurrentScreen('signup'),
    navigateToAllTransactions: () => setCurrentScreen('all_transactions'),
    handleScanSuccess,
  };
}

export default useNavigationFlow;
