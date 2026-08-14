import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import paymentService from '../services/paymentService';

interface UseTransferAmountOptions {
  creditorId: string;
  initialAmount?: string;
  onConfirmSuccess: () => void;
}

export function useTransferAmount({ creditorId, initialAmount = '', onConfirmSuccess }: UseTransferAmountOptions) {
  const { session, updateSession } = useAuth();
  const [amountStr, setAmountStr] = useState<string>(initialAmount);
  const [note, setNote] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const handleKeyPress = (val: string) => {
    if (val === '⌫') {
      setAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (val === '.') {
      if (!amountStr.includes('.')) {
        setAmountStr((prev) => prev + '.');
      }
    } else {
      if (amountStr === '0') {
        setAmountStr(val);
      } else {
        if (amountStr.includes('.') && amountStr.split('.')[1].length >= 2) return;
        setAmountStr((prev) => prev + val);
      }
    }
  };

  const handleAddPreset = (val: number) => {
    const current = parseFloat(amountStr) || 0;
    setAmountStr((current + val).toString());
  };

  const handleConfirm = async () => {
    if (!session?.accountId) {
      Alert.alert('Error', 'You must be logged in to send money.');
      return;
    }

    setIsProcessing(true);
    try {
      await paymentService.processPayment(session.accountId, creditorId, amountStr, note);
      
      // Deduct the balance locally so it reflects immediately
      const currentBalance = parseFloat(session.balance) || 0;
      const transferAmount = parseFloat(amountStr) || 0;
      await updateSession({ balance: (currentBalance - transferAmount).toString() });
      
      setShowSuccessModal(true);
    } catch (e: any) {
      Alert.alert('Payment Failed', e.message || 'An error occurred during transfer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    onConfirmSuccess();
  };

  return {
    amountStr,
    note,
    setNote,
    isProcessing,
    showSuccessModal,
    handleKeyPress,
    handleAddPreset,
    handleConfirm,
    handleCloseModal,
  };
}

export default useTransferAmount;
