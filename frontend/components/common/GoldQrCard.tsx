import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface GoldQrCardProps {
  qrValue: string;
  title?: string;
  subtitle?: string;
  subBadgeText?: string;
  size?: number;
  qrColor?: string;
  qrBgColor?: string;
}

export const GoldQrCard: React.FC<GoldQrCardProps> = ({
  qrValue,
  title,
  subtitle,
  subBadgeText,
  size = 180,
  qrColor = '#0ea5e9',
  qrBgColor = '#f8fafc',
}) => {
  return (
    <View className="bg-white border-2 border-slate-200 rounded-3xl p-6 mb-6 items-center shadow-xl relative overflow-hidden">
      {/* Corner Bracket Accents matching QR Color */}
      <View className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: qrColor }} />
      <View className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: qrColor }} />
      <View className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: qrColor }} />
      <View className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: qrColor }} />

      {/* Title / Account Name */}
      {title && (
        <Text className="text-slate-900 font-extrabold text-xl uppercase tracking-widest mb-1">
          {title}
        </Text>
      )}
      <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
        Scan to Pay Instantly
      </Text>

      {/* QR Display Container */}
      <View
        className="p-4 rounded-2xl border border-slate-200/80 mb-2 items-center justify-center shadow-inner"
        style={{ backgroundColor: qrBgColor }}
      >
        <QRCode
          value={qrValue || 'qpay:empty'}
          size={size}
          color={qrColor}
          backgroundColor={qrBgColor}
        />
      </View>
    </View>
  );
};

export default GoldQrCard;
