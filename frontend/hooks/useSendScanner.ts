import { useState } from 'react';
import { useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import contactService, { Contact } from '../services/contactService';
import paymentService from '../services/paymentService';

export function useSendScanner() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const contacts: Contact[] = contactService.getFrequentContacts();

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    const parsed = paymentService.parseQrPayload(data);
    router.push({
      pathname: '/(app)/transfer',
      params: {
        recipientName: parsed.recipientName || 'Recipient',
        accountId: parsed.accountId,
        amount: parsed.amount || '',
        qrValue: data,
      },
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
