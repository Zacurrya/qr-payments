import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useTransferAmount } from '@/hooks/useTransferAmount';
import { useAccount } from '@/hooks/useAccount';
import { ScreenHeader } from './common/ScreenHeader';
import { NumericKeypad } from './common/NumericKeypad';
import { ActionButton } from './common/ActionButton';
import paymentService from '@/services/paymentService';
import { getCurrencySymbol, convertCurrency, currencySymbols } from '../utils/currencyUtils';

export const TransferAmountScreen: React.FC = () => {
  const { recipientName, accountId, amount: initialAmount } = useLocalSearchParams<{
    recipientName: string;
    accountId: string;
    amount: string;
  }>();

  const { balance, currency: baseCurrency } = useAccount();
  const {
    amountStr,
    selectedCurrency,
    setSelectedCurrency,
    isProcessing,
    showSuccessModal,
    handleKeyPress,
    handleConfirm,
    handleCloseModal,
  } = useTransferAmount({ creditorId: accountId || '', initialAmount: initialAmount || '' });

  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  // Set initial selected currency to base currency once loaded
  useEffect(() => {
    if (baseCurrency && !selectedCurrency) {
      setSelectedCurrency(baseCurrency);
    }
  }, [baseCurrency]);

  const activeCurrency = selectedCurrency || baseCurrency || 'USD';
  const amountNum = parseFloat(amountStr) || 0;

  // Calculate converted equivalent if sending in a different currency
  const convertedAmount = convertCurrency(amountNum, activeCurrency, baseCurrency || 'USD');
  const showConverted = activeCurrency !== baseCurrency && amountNum > 0;

  const currencies = Object.keys(currencySymbols);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-5 pt-4">
        <ScreenHeader title="Payment Amount" />

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
          <View className="bg-white border-2 border-sky-500/40 rounded-3xl p-6 items-center mb-6 shadow-2xl relative">
            <View className="flex-row items-center justify-between w-full mb-2">
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest">Enter Amount</Text>

              {/* Currency Selector Dropdown Button */}
              <TouchableOpacity
                className="flex-row items-center bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200"
                onPress={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              >
                <Text className="text-slate-700 font-bold mr-1">{activeCurrency} ({getCurrencySymbol(activeCurrency)})</Text>
                <Text className="text-slate-500 text-xs">▼</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-sky-500 font-black text-5xl tracking-tight mb-1">
              {getCurrencySymbol(activeCurrency)}{amountStr || '0'}
            </Text>

            {showConverted && (
              <Text className="text-slate-400 font-semibold text-lg mb-2">
                {getCurrencySymbol(baseCurrency)}{convertedAmount.toFixed(2)}
              </Text>
            )}

            <View className="bg-slate-50 px-3 py-1 rounded-full border border-slate-200 mt-2">
              <Text className="text-slate-500 text-xs">
                Available Balance: <Text className="text-slate-900 font-bold">{paymentService.formatCurrency(balance, baseCurrency)}</Text>
              </Text>
            </View>

            {/* Inline Currency List (Horizontal Scroll) */}
            {isCurrencyDropdownOpen && (
              <View className="w-full mt-4 border-t border-slate-100 pt-3">
                <Text className="text-slate-400 text-xs mb-2">Select Currency:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                  {currencies.map(c => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => {
                        setSelectedCurrency(c);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className={`mr-2 px-4 py-2 rounded-xl border ${activeCurrency === c ? 'bg-sky-500 border-sky-500' : 'bg-white border-slate-200'}`}
                    >
                      <Text className={`font-bold ${activeCurrency === c ? 'text-white' : 'text-slate-600'}`}>
                        {c} ({getCurrencySymbol(c)})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Custom Numeric Keypad */}
          <NumericKeypad onKeyPress={handleKeyPress} />

          {/* Confirm Payment CTA */}
          <View className="items-center w-full mt-2">
            <ActionButton
              label={isProcessing ? 'Processing...' : `Send ${getCurrencySymbol(activeCurrency)}${amountStr || '0'} Now`}
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
              You sent <Text className="text-sky-500 font-bold">{getCurrencySymbol(activeCurrency)}{amountStr}</Text>
              {showConverted && <Text> ({getCurrencySymbol(baseCurrency)}{convertedAmount.toFixed(2)})</Text>} to {recipientName || 'Recipient'}.
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
