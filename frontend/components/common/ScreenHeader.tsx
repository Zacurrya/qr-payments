import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack, rightElement }) => {
  return (
    <View className="flex-row items-center justify-between mb-4">
      {onBack ? (
        <TouchableOpacity 
          onPress={onBack}
          className="w-10 h-10 rounded-xl bg-midnight-900 border border-midnight-800 items-center justify-center active:bg-gold-500/20"
        >
          <Text className="text-gold-300 text-lg font-bold">←</Text>
        </TouchableOpacity>
      ) : (
        <View className="w-10" />
      )}

      <Text className="text-slate-100 font-extrabold text-lg">{title}</Text>

      <View className="w-10 items-end">
        {rightElement || <View className="w-10" />}
      </View>
    </View>
  );
};

export default ScreenHeader;
