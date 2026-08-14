import React from 'react';
import { Feather } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAccount } from '../hooks/useAccount';
import { ExecutiveBalanceCard } from './common/ExecutiveBalanceCard';
import { ActionButton } from './common/ActionButton';
import { RecentTransactions } from './common/RecentTransactions';

interface HomeScreenProps {
  onShowAllTransactions?: () => void;
  onSendMoney?: () => void;
  onReceivePayment?: () => void;
  onLogOut?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onShowAllTransactions,
  onSendMoney,
  onReceivePayment,
  onLogOut,
}) => {
  const { userFullName, balance, cardNumber, currency, transactions, fetchTransactions, loadingTransactions } = useAccount();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Decorative Circles */}
      <View className="absolute -top-32 -right-32 w-96 h-96 bg-sky-500/5 rounded-full" style={{ zIndex: -1 }} />
      <View className="absolute top-1/2 -left-32 w-72 h-72 bg-emerald-500/5 rounded-full" style={{ zIndex: -1 }} />

      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        className="px-5 pt-4"
      >
        {/* Header Bar */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1">
            <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Welcome back</Text>
            <Text className="text-slate-900 font-bold text-lg">{userFullName}</Text>
          </View>

          <View className="flex-1 items-center">
            <Text className="text-sky-500 font-extrabold text-4xl tracking-tighter">Q<Text className="text-slate-900">pay</Text></Text>
          </View>

          <View className="flex-1 items-end">
            {onLogOut ? (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Log Out",
                    "Are you sure you want to log out?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Log Out", style: "destructive", onPress: onLogOut }
                    ]
                  );
                }}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 items-center justify-center"
              >
                <Feather name="log-out" size={16} color="#94a3b8" />
              </TouchableOpacity>
            ) : <View className="w-10" />}
          </View>
        </View>

        {/* Executive Balance Hero Card */}
        <ExecutiveBalanceCard
          balance={balance}
          currency={currency}
          cardNumber={cardNumber}
        />

        {/* Primary Action Buttons */}
        <View className="flex-row gap-4 mt-8 mb-8">
          <View className="flex-1">
            <ActionButton
              label="Send Money"
              sublabel="Scan QR or Contact"
              icon="↗"
              variant="primary"
              onPress={onSendMoney}
            />
          </View>
          <View className="flex-1">
            <ActionButton
              label="Receive Payment"
              sublabel="Show Personal QR"
              icon="↙"
              variant="secondary"
              onPress={onReceivePayment}
            />
          </View>
        </View>

        {/* Recent Transactions */}
        <RecentTransactions
          transactions={transactions}
          onShowAll={onShowAllTransactions || (() => { })}
          loading={loadingTransactions}
          currency={currency}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

