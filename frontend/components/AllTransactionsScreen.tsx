import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from './common/ScreenHeader';
import { useAuth } from '../hooks/useAuth';
import paymentService from '../services/paymentService';
import ledgerService from '../services/ledgerService';

interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: string;
  isIncome: boolean;
  time: string;
  dateMarker: string;
  icon: string;
}

interface TransactionSection {
  title: string;
  data: Transaction[];
}

interface AllTransactionsScreenProps {
  onBack: () => void;
}

export const AllTransactionsScreen: React.FC<AllTransactionsScreenProps> = ({ onBack }) => {
  const { session } = useAuth();
  const [sections, setSections] = useState<TransactionSection[]>([]);
  const [loading, setLoading] = useState(true);

  const currency = session?.currency ?? 'USD';

  useEffect(() => {
    const fetchAll = async () => {
      if (!session?.accountId) return;
      try {
        setLoading(true);
        // Fetch up to 1000 transactions for the "All Transactions" view
        const data = await ledgerService.getAccountLedgers(session.accountId, 1000);

        // Map the backend data to our frontend Transaction object
        const mapped: Transaction[] = data.map(entry => {
          let title = entry.referenceCode;
          if (!title) {
            if (entry.counterpartyUsername) {
              title = entry.counterpartyUsername;
            } else {
              title = entry.entryType === 'CREDIT' ? 'Payment Received' : 'Payment Sent';
            }
          }

          const dateObj = new Date(entry.createdAt);

          return {
            id: entry.id,
            title: title,
            category: entry.entryType === 'CREDIT' ? 'Income' : 'Expense',
            amount: Math.abs(entry.amount).toFixed(2),
            isIncome: entry.entryType === 'CREDIT',
            time: dateObj.toLocaleTimeString(undefined, {
              hour: '2-digit', minute: '2-digit'
            }),
            dateMarker: dateObj.toLocaleDateString(undefined, {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            }),
            icon: entry.entryType === 'CREDIT' ? 'arrow-down-left' : 'arrow-up-right'
          };
        });

        // Group transactions by dateMarker
        const groupedMap = new Map<string, Transaction[]>();
        mapped.forEach(t => {
          if (!groupedMap.has(t.dateMarker)) {
            groupedMap.set(t.dateMarker, []);
          }
          groupedMap.get(t.dateMarker)!.push(t);
        });

        // Convert to SectionList format array
        const groupedArray: TransactionSection[] = Array.from(groupedMap.entries()).map(([dateMarker, txs]) => ({
          title: dateMarker,
          data: txs,
        }));

        setSections(groupedArray);
      } catch (error) {
        console.error('Failed to fetch all transactions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [session?.accountId]);

  const renderItem = ({ item }: { item: Transaction }) => (
    <View className="flex-row items-center justify-between py-3.5">
      <View className="flex-row items-center gap-4">
        <View
          className={`w-12 h-12 rounded-full items-center justify-center ${
            item.isIncome ? 'bg-emerald-500/10' : 'bg-red-500/10'
          }`}
        >
          <Feather
            name={item.icon as any}
            size={20}
            color={item.isIncome ? '#10b981' : '#ef4444'}
          />
        </View>
        <View>
          <Text className="text-slate-100 font-bold text-base">{item.title}</Text>
          <Text className="text-slate-400 text-xs mt-1">{item.time}</Text>
        </View>
      </View>
      <Text
        className={`font-bold text-base ${
          item.isIncome ? 'text-emerald-400' : 'text-slate-100'
        }`}
      >
        {item.isIncome ? '+' : '-'}{paymentService.formatCurrency(item.amount, currency)}
      </Text>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }: { section: TransactionSection }) => (
    <View className="pt-4 pb-1 mt-2 mb-1">
      <Text className="text-gold-500 font-bold text-xs uppercase tracking-widest">{title}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-midnight-950">
      <View className="px-5 pt-4 flex-1">
        <ScreenHeader title="All Transactions" onBack={onBack} />
        
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#D4AF37" />
          </View>
        ) : sections.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-slate-400">No transactions found.</Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            stickySectionHeadersEnabled={true}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AllTransactionsScreen;
