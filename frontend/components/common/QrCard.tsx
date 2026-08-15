import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { QPayLogo } from './QPayLogo';

interface GoldQrCardProps {
  qrValue: string;
  title?: string;
  subtitle?: string;
  subBadgeText?: string;
  size?: number;
  qrColor?: string;
  qrBgColor?: string;
}

export const QrCard: React.FC<GoldQrCardProps> = ({
  qrValue,
  title,
  subtitle = 'SCAN TO PAY',
  size = 180,
  qrColor = '#0ea5e9',
}) => {
  return (
    <View
      className="mb-6 items-center shadow-2xl rounded-xl overflow-hidden"
      style={{
        backgroundColor: qrColor,
      }}
    >
      {/* Top White Header Bar for QPay Logo with dynamic Q colour */}
      <View className="w-full bg-white py-3.5 items-center justify-center">
        <QPayLogo size="sm" colour={qrColor} />
      </View>

      {/* Main Stand Area with Theme Background */}
      <View className="w-full px-6 pt-5 pb-6 items-center">
        {/* Call to Action Header */}
        <Text className="text-white font-black text-xl uppercase tracking-widest mb-4 text-center">
          {subtitle}
        </Text>

        {/* Square White QR Card with rounded corners */}
        <View
          className="bg-white px-6 pt-6 pb-5 items-center justify-center shadow-lg mb-4"
        >
          <QRCode
            value={qrValue || 'qpay:empty'}
            size={size}
            color="#0f172a"
            backgroundColor="#ffffff"
          />
          {title && (
            <Text className="text-slate-900 font-extrabold text-sm uppercase tracking-widest text-center mt-4">
              {title}
            </Text>
          )}
        </View>

        {/* Footer Info */}
        <Text className="text-white/80 font-medium text-[9px] uppercase tracking-widest text-center px-4">
          Instant multi-currency mobile payments
        </Text>
      </View>
    </View>
  );
};

export default QrCard;
