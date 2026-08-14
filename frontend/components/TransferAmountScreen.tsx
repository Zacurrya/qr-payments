import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransferAmount } from '@/hooks/useTransferAmount';
import { useAccount } from '@/hooks/useAccount';
import { ScreenHeader } from './common/ScreenHeader';
import { NumericKeypad } from './common/NumericKeypad';
import { ActionButton } from './common/ActionButton';
import paymentService from '@/services/paymentService';
import { getCurrencySymbol } from '../utils/currencyUtils';

interface TransferAmountScreenProps {
  recipientName: string;
  accountId: string;
  initialAmount?: string;
  onBack: () => void;
  onConfirmSuccess: () => void;
}

export const TransferAmountScreen: React.FC<TransferAmountScreenProps> = ({
  recipientName,
  accountId,
  initialAmount = '',
  onBack,
  onConfirmSuccess,
}) => {
  const { balance, currency } = useAccount();
  const {
    amountStr,
    isProcessing,
    showSuccessModal,
    handleKeyPress,
    handleConfirm,
    handleCloseModal,
  } = useTransferAmount({ creditorId: accountId, initialAmount, onConfirmSuccess });

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-5 pt-4">
        <ScreenHeader title="Payment Amount" onBack={onBack} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}>
          {/* Recipient Badge */}
          <View className="bg-white border border-sky-500/30 p-4 rounded-2xl flex-row items-center mb-6">
            <View className="w-12 h-12 rounded-2xl bg-slate-100 border border-sky-500/40 items-center justify-center mr-4">
              <Text className="text-sky-500 font-extrabold text-lg">
                {recipientName ? recipientName.charAt(0).toUpperCase() : '✦'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-slate-500 text-xs font-semibold uppercase">Paying Recipient</Text>
              <Text className="text-slate-900 font-extrabold text-base">{recipientName || 'Unknown Account'}</Text>
            </View>
          </View>

          {/* Amount Display */}
          <View className="bg-white border-2 border-sky-500/40 rounded-3xl p-6 items-center mb-6 shadow-2xl">
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Enter Amount ({currency || 'USD'})</Text>
            <Text className="text-sky-500 font-black text-5xl tracking-tight mb-2">
              {getCurrencySymbol(currency)}{amountStr || '0'}
            </Text>
            <View className="bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              <Text className="text-slate-500 text-xs">
                Available Balance: <Text className="text-slate-900 font-bold">{paymentService.formatCurrency(balance, currency)}</Text>
              </Text>
            </View>
          </View>

          {/* Custom Numeric Keypad */}
          <NumericKeypad onKeyPress={handleKeyPress} />

          {/* Confirm Payment CTA (Decreased Width) */}
          <View className="items-center w-full mt-2">
            <ActionButton
              label={isProcessing ? 'Processing Transfer...' : `Send ${getCurrencySymbol(currency)}${amountStr || '0'} Now`}
              variant="primary"
              className="w-4/5 max-w-sm py-3.5"
              onPress={handleConfirm}
              disabled={isProcessing || parseFloat(amountStr) <= 0}
            />
          </View>
        </ScrollView>
      </View>

      {/* Success Modal Overlay */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View className="flex-1 bg-black/80 items-center justify-center px-6">
          <View className="w-full bg-white border-2 border-sky-500/50 rounded-3xl p-6 items-center shadow-2xl">
            <View className="w-16 h-16 rounded-full bg-sky-500/20 border-2 border-sky-400 items-center justify-center mb-4">
              <Text className="text-sky-500 font-bold text-3xl">✓</Text>
            </View>
            <Text className="text-sky-500 font-black text-2xl mb-1">Transfer Complete</Text>
            <Text className="text-slate-800 text-sm text-center mb-4">
              You sent <Text className="text-sky-500 font-bold">{getCurrencySymbol(currency)}{amountStr}</Text> to {recipientName || 'Recipient'}.
            </Text>

            <ActionButton
              label="Return to Home"
              variant="primary"
              onPress={handleCloseModal}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TransferAmountScreen;

