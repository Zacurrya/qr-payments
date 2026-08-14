import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface GoldQrCardProps {
  qrValue: string;
  title?: string;
  subtitle?: string;
  subBadgeText?: string;
  size?: number;
}

export const GoldQrCard: React.FC<GoldQrCardProps> = ({
  qrValue,
  title,
  subtitle,
  subBadgeText,
  size = 180,
}) => {
  return (
    <View className="bg-white border-2 border-sky-500/40 rounded-3xl p-6 mb-6 items-center shadow-2xl relative overflow-hidden">
      {/* Corner Bracket Accents */}
      <View className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-sky-400" />
      <View className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-sky-400" />
      <View className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-sky-400" />
      <View className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-sky-400" />

      {/* Username */}
      {title && (
        <Text className="text-sky-500 font-extrabold text-xl uppercase tracking-widest mb-4">
          {title}
        </Text>
      )}

      {/* QR Display Container */}
      <View className="p-4 bg-slate-50 rounded-2xl border border-sky-500/30 mb-4 items-center justify-center shadow-inner">
        <QRCode
          value={qrValue}
          size={size}
          color="#0ea5e9"
          backgroundColor="#f8fafc"
        />
      </View>

    </View>
  );
};

export default GoldQrCard;
