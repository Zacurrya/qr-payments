import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView } from 'expo-camera';
import { useSendScanner } from '../hooks/useSendScanner';
import { ScreenHeader } from './common/ScreenHeader';

interface SendMoneyScreenProps {
  onBack: () => void;
  onScanSuccess: (data: { recipientName: string; accountId: string; qrValue: string }) => void;
}

export const SendMoneyScreen: React.FC<SendMoneyScreenProps> = ({ onBack, onScanSuccess }) => {
  const {
    permission,
    requestPermission,
    scanned,
    torch,
    toggleTorch,
    handleBarCodeScanned,
    resetScan,
  } = useSendScanner({ onScanSuccess });

  const flashlightButton = (
    <TouchableOpacity
      onPress={toggleTorch}
      className={`w-10 h-10 rounded-xl border items-center justify-center ${torch ? 'bg-sky-500 border-sky-400' : 'bg-white border-slate-200'}`}
    >
      <Text className={`text-base ${torch ? 'text-white' : 'text-sky-500'}`}>🔦</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-5 pt-4">
        <ScreenHeader
          title="Scan QR Code"
          onBack={onBack}
          rightElement={flashlightButton}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}>
          <Text className="text-slate-500 text-xs text-center mb-4">
            Scan another user's QR code to send money
          </Text>

          {/* Scanner Window */}
          <View className="w-full h-full rounded-3xl bg-white border-2 border-sky-500/50 overflow-hidden relative shadow-2xl items-center justify-center">
            {permission?.granted ? (
              scanned ? (
                <View className="px-6 items-center">
                  <Text className="text-sky-500 font-bold text-base text-center mb-3">QR Code Detected</Text>
                  <TouchableOpacity
                    onPress={resetScan}
                    className="bg-sky-500 px-5 py-2.5 rounded-xl"
                  >
                    <Text className="text-white font-bold text-xs">Scan Again</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <CameraView
                  style={StyleSheet.absoluteFillObject}
                  enableTorch={torch}
                  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                  onBarcodeScanned={handleBarCodeScanned}
                />
              )
            ) : (
              <View className="px-6 items-center">
                <Text className="text-sky-500 font-bold text-base text-center mb-2">Camera Permission Needed</Text>
                <Text className="text-slate-500 text-xs text-center mb-4">Enable camera access to scan QR payment codes live.</Text>
                <TouchableOpacity
                  onPress={requestPermission}
                  className="bg-sky-500 px-5 py-2.5 rounded-xl"
                >
                  <Text className="text-white font-bold text-xs">Grant Access</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Corner Accents */}
            <View className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-sky-300" />
            <View className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-sky-300" />
            <View className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-sky-300" />
            <View className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-sky-300" />

            <View className="w-48 h-0.5 bg-gold-400 shadow-md shadow-gold-300 opacity-80" />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SendMoneyScreen;

