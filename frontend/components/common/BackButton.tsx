import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface BackButtonProps {
  onPress: () => void;
  className?: string;
  size?: number;
  color?: string;
  isDarkTheme?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  className = '',
  size = 20,
  color,
  isDarkTheme,
}) => {
  const iconColor = color || (isDarkTheme ? '#e2e8f0' : '#0ea5e9');
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={`w-10 h-10 rounded-2xl border items-center justify-center shadow-sm ${
        isDarkTheme ? 'bg-slate-800 border-slate-700 active:bg-slate-700' : 'bg-white border-slate-200 active:bg-sky-500/10'
      } ${className}`}
    >
      <Feather name="chevron-left" size={size} color={iconColor} />
    </TouchableOpacity>
  );
};

export default BackButton;
