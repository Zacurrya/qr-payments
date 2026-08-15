import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { BackButton } from './BackButton';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  isDarkTheme?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack, rightElement, isDarkTheme }) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between mb-4">
      <BackButton
        onPress={onBack ?? (() => router.back())}
        isDarkTheme={isDarkTheme}
      />

      <Text
        className={`text-2xl font-extrabold text-center tracking-tight ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}
      >
        {title}
      </Text>

      <View className="w-10 items-end">
        {rightElement || <View className="w-10" />}
      </View>
    </View>
  );
};

export default ScreenHeader;
