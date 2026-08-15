import React from 'react';
import { View, Text } from 'react-native';
import paymentService from '@/services/paymentService';

interface ExecutiveBalanceCardProps {
  balance: number;
  currency?: string;
  growthPercentage?: string;
  cardNumber?: string;
}

export const ExecutiveBalanceCard: React.FC<ExecutiveBalanceCardProps> = ({
  balance,
  currency = 'USD',
  growthPercentage,
}) => {
  return (
    <View className="bg-white border-2 border-sky-500/40 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
      {/* Background Accent Glow */}
      <View className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-sky-500/10" />

      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-sky-500 font-bold text-sm uppercase tracking-widest">Balance</Text>
          <Text className="text-slate-900 text-4xl font-black tracking-tight mt-1">
            {paymentService.formatCurrency(balance, currency)}
          </Text>
        </View>
        {growthPercentage && (
          <View className="bg-sky-500/20 border border-sky-500/40 px-3 py-1 rounded-full">
            <Text className="text-sky-500 text-xs font-black">{growthPercentage} ↗</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ExecutiveBalanceCard;

