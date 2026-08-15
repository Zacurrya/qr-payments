import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './useAuth';
import paymentService from '../services/paymentService';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface UseTransferAmountOptions {
  creditorId: string;
  initialAmount?: string;
}

export function useTransferAmount({ creditorId, initialAmount = '' }: UseTransferAmountOptions) {
  const router = useRouter();
  const { session, updateSession } = useAuth();
  const [amountStr, setAmountStr] = useState<string>(initialAmount);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
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

    const idempotencyKey = uuidv4();

    setIsProcessing(true);
    try {
      const currencyToSend = selectedCurrency || session.currency;
      await paymentService.processPayment(session.accountId, creditorId, amountStr, currencyToSend, note, idempotencyKey);

      if (currencyToSend === session.currency) {
        const currentBalance = parseFloat(session.balance) || 0;
        const transferAmountInBase = parseFloat(amountStr) || 0;
        await updateSession({ balance: (currentBalance - transferAmountInBase).toString() });
      }

      setShowSuccessModal(true);
    } catch (e: any) {
      Alert.alert('Payment Failed', e.message || 'An error occurred during transfer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.replace('/(app)/home');
  };

  return {
    amountStr,
    note,
    setNote,
    selectedCurrency,
    setSelectedCurrency,
    isProcessing,
    showSuccessModal,
    handleKeyPress,
    handleAddPreset,
    handleConfirm,
    handleCloseModal,
  };
}

export default useTransferAmount;
