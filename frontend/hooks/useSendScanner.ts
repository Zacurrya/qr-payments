import { useState } from 'react';
import { useCameraPermissions } from 'expo-camera';
import contactService, { Contact } from '../services/contactService';

interface UseSendScannerOptions {
  onScanSuccess: (data: { recipientName: string; accountId: string; qrValue: string }) => void;
}

export function useSendScanner({ onScanSuccess }: UseSendScannerOptions) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const contacts: Contact[] = contactService.getFrequentContacts();

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    onScanSuccess({
      recipientName: 'QR Merchant',
      accountId: '',
      qrValue: data,
    });
  };

  const resetScan = () => setScanned(false);

  const toggleTorch = () => setTorch(!torch);

  return {
    permission,
    requestPermission,
    scanned,
    torch,
    toggleTorch,
    contacts,
    handleBarCodeScanned,
    resetScan,
  };
}

export default useSendScanner;

