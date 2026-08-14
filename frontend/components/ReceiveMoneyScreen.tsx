import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReceiveMoney } from '@/hooks/useReceiveMoney';
import { ScreenHeader } from './common/ScreenHeader';
import { GoldQrCard } from './common/GoldQrCard';

interface ReceiveMoneyScreenProps {
  onBack: () => void;
}

export const ReceiveMoneyScreen: React.FC<ReceiveMoneyScreenProps> = ({ onBack }) => {
  const {
    username,
    qrPayload,
  } = useReceiveMoney();

  return (
    <SafeAreaView className="flex-1 bg-midnight-950">
      <View className="flex-1 px-5 pt-20">
        <ScreenHeader title="Receive Payment" onBack={onBack} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}>
          {/* Executive QR Showcase Card */}
          <GoldQrCard
            qrValue={qrPayload}
            title={username}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ReceiveMoneyScreen;
