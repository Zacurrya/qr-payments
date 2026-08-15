import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

export type QPayLogoSize = 'sm' | 'md' | 'lg' | 'xl' | number;

interface QPayLogoProps {
  size?: QPayLogoSize;
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  dark?: boolean;
  colour?: string;
}

const SIZE_CONFIGS: Record<'sm' | 'md' | 'lg' | 'xl', { fontSize: number; lineHeight: number; subtitleSize: number }> = {
  sm: { fontSize: 36, lineHeight: 32, subtitleSize: 10 },
  md: { fontSize: 52, lineHeight: 46, subtitleSize: 11 },
  lg: { fontSize: 68, lineHeight: 58, subtitleSize: 12 },
  xl: { fontSize: 84, lineHeight: 70, subtitleSize: 13 },
};

export const QPayLogo: React.FC<QPayLogoProps> = ({
  size = 'lg',
  showSubtitle = false,
  subtitle = 'QR Payment Demo',
  className = '',
  style,
  dark = false,
  colour,
}) => {
  const activeQColor = colour || '#0ea5e9';
  const config = typeof size === 'number'
    ? { fontSize: size, lineHeight: Math.round(size * 0.85), subtitleSize: Math.max(10, Math.round(size * 0.18)) }
    : SIZE_CONFIGS[size] || SIZE_CONFIGS.lg;

  const textColorPay = dark ? '#ffffff' : '#0f172a';
  const textSubColor = dark ? '#94a3b8' : '#64748b';

  return (
    <View className={`items-center justify-center ${className}`} style={style}>
      <Text
        style={[
          styles.fontDongle,
          {
            fontSize: config.fontSize,
            lineHeight: config.lineHeight,
            includeFontPadding: false,
          },
        ]}
      >
        <Text style={{ color: activeQColor }}>Q</Text>
        <Text style={{ color: textColorPay }}>pay</Text>
      </Text>

      {showSubtitle && (
        <Text
          className="uppercase tracking-widest font-semibold"
          style={{
            fontSize: config.subtitleSize,
            color: textSubColor,
            marginTop: 2,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fontDongle: {
    fontFamily: 'Dongle_400Regular',
  },
});

export default QPayLogo;
