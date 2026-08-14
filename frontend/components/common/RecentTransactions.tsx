import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Transaction } from '../../hooks/useAccount';
import paymentService from '../../services/paymentService';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onShowAll: () => void;
  loading?: boolean;
  currency?: string;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onShowAll,
  loading = false,
  currency = 'USD',
}) => {
  
  // Group transactions by dateMarker
  const groupedMap = new Map<string, Transaction[]>();
  transactions.forEach(t => {
    if (!groupedMap.has(t.dateMarker)) {
      groupedMap.set(t.dateMarker, []);
    }
    groupedMap.get(t.dateMarker)!.push(t);
  });
  
  const groupedArray = Array.from(groupedMap.entries());

  return (
    <View className="bg-white rounded-3xl p-5 border-2 border-sky-500/40 shadow-2xl">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-slate-900 font-bold text-lg">Recent</Text>
      </View>

      {loading && transactions.length === 0 ? (
        <ActivityIndicator size="small" color="#94a3b8" className="py-4" />
      ) : transactions.length === 0 ? (
        <Text className="text-slate-500 text-center py-4">No recent transactions found.</Text>
      ) : (
        <View className="flex-col">
          {groupedArray.map(([dateMarker, txs]) => (
            <View key={dateMarker} className="mb-2">
              <View className="pt-2 pb-1 mt-2 mb-1">
                <Text className="text-sky-500 font-bold text-xs uppercase tracking-widest">{dateMarker}</Text>
              </View>
              <View className="flex-col gap-5">
                {txs.map((t, index) => (
                  <View key={t.id || index} className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-4">
                      <View
                        className={`w-10 h-10 rounded-full items-center justify-center ${
                          t.isIncome ? 'bg-emerald-500/20' : 'bg-red-500/20'
                        }`}
                      >
                        <Feather
                          name={t.icon as any}
                          size={18}
                          color={t.isIncome ? '#10b981' : '#ef4444'}
                        />
                      </View>
                      <View>
                        <Text className="text-slate-900 font-bold text-base">{t.title}</Text>
                        <Text className="text-slate-500 text-xs mt-1">{t.time}</Text>
                      </View>
                    </View>
                    <Text
                      className={`font-bold text-base ${
                        t.isIncome ? 'text-emerald-400' : 'text-slate-900'
                      }`}
                    >
                      {t.isIncome ? '+' : '-'}{paymentService.formatCurrency(t.amount, currency)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {transactions.length > 0 && (
        <TouchableOpacity
          onPress={onShowAll}
          className="mt-8 py-2 px-6 bg-slate-100 rounded-xl self-center border border-midnight-700 active:bg-midnight-700"
        >
          <Text className="text-slate-800 font-semibold text-xs">Show All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
