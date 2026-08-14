import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import * as Print from 'expo-print';
import { useReceiveMoney } from '@/hooks/useReceiveMoney';
import { ScreenHeader } from './common/ScreenHeader';
import { GoldQrCard } from './common/GoldQrCard';
import { ColorSpectrumPicker } from './common/ColorSpectrumPicker';
import { generateMerchantPosterHtml } from '../utils/printTemplate';
import { ColorContext } from '../context/ColorContext';

interface ReceiveMoneyScreenProps {
  onBack: () => void;
}

const QR_PRESET_COLORS = [
  { name: 'Sky Blue', hex: '#0ea5e9' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Midnight', hex: '#0f172a' },
];

export const ReceiveMoneyScreen: React.FC<ReceiveMoneyScreenProps> = ({ onBack }) => {
  const { username, qrPayload } = useReceiveMoney();
  const { qrColor, setQrColor, bgColor, setBgColor, isLoadingColors } = useContext(ColorContext);
  
  const [showSpectrumPicker, setShowSpectrumPicker] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    if (!qrPayload) {
      Alert.alert('Error', 'No QR data available to print.');
      return;
    }

    try {
      setIsPrinting(true);
      const html = generateMerchantPosterHtml({
        username: username || 'Merchant',
        qrPayload,
        selectedColor: qrColor,
        selectedBgColor: bgColor,
      });

      await Print.printAsync({ html });
    } catch (e: any) {
      console.error('Printing error:', e);
      Alert.alert('Print Error', e.message || 'Failed to open print preview.');
    } finally {
      setIsPrinting(false);
    }
  };

  const isCustomColor = !QR_PRESET_COLORS.some(
    (c) => c.hex.toLowerCase() === qrColor.toLowerCase()
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Ambient Circles */}
      <View className="absolute -top-32 -right-32 w-80 h-80 bg-sky-500/10 rounded-full" style={{ zIndex: -1 }} />
      <View className="absolute bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full" style={{ zIndex: -1 }} />

      <View className="flex-1 px-5 pt-4">
        <ScreenHeader
          title="Receive Payment"
          onBack={onBack}
          rightElement={
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePrint}
              disabled={isPrinting}
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200 items-center justify-center shadow-sm active:bg-sky-500/10"
            >
              <Feather name="printer" size={18} color={qrColor} />
            </TouchableOpacity>
          }
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
          {/* QR Showcase Card with Live QR */}
          <GoldQrCard
            qrValue={qrPayload}
            title={username}
            qrColor={qrColor}
          />

          {/* Color Customizer Card */}
          <View className="bg-white border border-slate-200 rounded-3xl p-5 mb-6 shadow-sm space-y-5">
            {/* QR Pattern Colour Selector */}
            <View>
              <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                QR Pattern Colour
              </Text>
              <View className="flex-row items-center justify-between">
                {QR_PRESET_COLORS.map((col) => {
                  const isSelected = qrColor.toLowerCase() === col.hex.toLowerCase();
                  return (
                    <TouchableOpacity
                      key={col.hex}
                      activeOpacity={0.8}
                      onPress={() => setQrColor(col.hex)}
                      style={{ backgroundColor: col.hex }}
                      className={`w-10 h-10 rounded-full items-center justify-center shadow-sm ${
                        isSelected ? 'border-4 border-slate-300 scale-110' : 'border border-slate-200'
                      }`}
                    >
                      {isSelected && (
                        <Feather
                          name="check"
                          size={16}
                          color="#ffffff"
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}

                {/* Rainbow Spectrum Wheel Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowSpectrumPicker(!showSpectrumPicker)}
                  className={`w-10 h-10 rounded-full items-center justify-center shadow-sm overflow-hidden border-2 ${
                    showSpectrumPicker || isCustomColor
                      ? 'border-slate-900 scale-110'
                      : 'border-slate-200'
                  }`}
                >
                  <Svg width="40" height="40" viewBox="0 0 40 40">
                    <Defs>
                      <LinearGradient id="rainbowWheel" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0%" stopColor="#ef4444" />
                        <Stop offset="20%" stopColor="#f59e0b" />
                        <Stop offset="40%" stopColor="#22c55e" />
                        <Stop offset="60%" stopColor="#06b6d4" />
                        <Stop offset="80%" stopColor="#6366f1" />
                        <Stop offset="100%" stopColor="#ec4899" />
                      </LinearGradient>
                    </Defs>
                    <Circle cx="20" cy="20" r="18" fill="url(#rainbowWheel)" />
                    <Circle cx="20" cy="20" r="7" fill="#ffffff" />
                  </Svg>
                </TouchableOpacity>
              </View>

              {/* Continuous Color Spectrum Graph Drawer */}
              {showSpectrumPicker && (
                <View className="mt-4 pt-4 border-t border-slate-100">
                  <ColorSpectrumPicker
                    color={qrColor}
                    onChangeColor={setQrColor}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ReceiveMoneyScreen;
