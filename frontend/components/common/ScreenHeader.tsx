import React from 'react';
import { View, Text } from 'react-native';
import { BackButton } from './BackButton';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  isDarkTheme?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack, rightElement, isDarkTheme }) => {
  return (
    <View className="flex-row items-center justify-between mb-4">
      {onBack ? (
        <BackButton onPress={onBack} isDarkTheme={isDarkTheme} />
      ) : (
        <View className="w-10" />
      )}

      <Text className={`font-extrabold text-lg ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>{title}</Text>

      <View className="w-10 items-end">
        {rightElement || <View className="w-10" />}
      </View>
    </View>
  );
};

export default ScreenHeader;
