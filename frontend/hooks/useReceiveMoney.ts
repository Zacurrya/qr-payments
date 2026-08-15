import { useState, useContext } from 'react';
import { Alert } from 'react-native';
import * as Print from 'expo-print';
import paymentService from '../services/paymentService';
import { useAuth } from './useAuth';
import { ColorContext } from '../context/ColorContext';
import { generateMerchantPosterHtml } from '../utils/printTemplate';

export const QR_PRESET_COLORS = [
  { name: 'Sky Blue', hex: '#0ea5e9' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Midnight', hex: '#0f172a' },
];

export function useReceiveMoney() {
  const { session } = useAuth();
  const [requestedAmount, setRequestedAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const { qrColor, setQrColor, bgColor, setBgColor, isLoadingColors } = useContext(ColorContext);
  const [showSpectrumPicker, setShowSpectrumPicker] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

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

  const handlePrint = async () => {
    if (!qrPayload) {
      Alert.alert('Error', 'No QR data available to print.');
      return;
    }

    try {
      setIsPrinting(true);
      const html = generateMerchantPosterHtml({
        username: session?.username || 'Merchant',
        qrPayload,
        selectedColor: qrColor,
        selectedBgColor: bgColor,
      });

      await Print.printAsync({ html });
    } catch (e: any) {
      console.error('Printing error:', e);
      Alert.alert('Print Error', e.message || 'Failed to open print preview.');
    } finally {
      setIsPrinting(false);
    }
  };

  const isCustomColor = !QR_PRESET_COLORS.some(
    (c) => c.hex.toLowerCase() === qrColor.toLowerCase()
  );

  return {
    username: session?.username || 'User',
    requestedAmount,
    setRequestedAmount,
    note,
    setNote,
    copied,
    qrPayload,
    handleCopy,
    qrColor,
    setQrColor,
    bgColor,
    setBgColor,
    isLoadingColors,
    showSpectrumPicker,
    setShowSpectrumPicker,
    isPrinting,
    handlePrint,
    isCustomColor,
    QR_PRESET_COLORS,
  };
}

export default useReceiveMoney;
