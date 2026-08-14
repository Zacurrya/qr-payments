import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface ActionButtonProps {
  label: string;
  sublabel?: string;
  icon?: string;
  variant?: 'primary' | 'secondary';
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  sublabel,
  icon,
  variant = 'primary',
  onPress,
  disabled = false,
  className = '',
}) => {
  const isPrimary = variant === 'primary';

  const containerClass = isPrimary
    ? 'bg-gold-500 border border-gold-400 shadow-xl shadow-gold-500/20 active:bg-gold-600'
    : 'bg-midnight-900 border-2 border-gold-500/60 active:bg-midnight-850';

  const textClass = isPrimary
    ? 'text-midnight-950 font-black'
    : 'text-gold-300 font-bold';

  const subtextClass = isPrimary
    ? 'text-midnight-900/80 font-semibold'
    : 'text-slate-400 font-semibold';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      className={`w-full py-4 px-4 rounded-2xl items-center justify-center space-y-1 ${containerClass} ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {icon && (
        <View className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${isPrimary ? 'bg-midnight-950/20' : 'bg-gold-500/20 border border-gold-500/40'}`}>
          <Text className={`font-black text-xl ${isPrimary ? 'text-midnight-950' : 'text-gold-300'}`}>{icon}</Text>
        </View>
      )}
      <Text className={`${textClass} text-base tracking-wide uppercase`}>{label}</Text>
      {sublabel && <Text className={`${subtextClass} text-xs`}>{sublabel}</Text>}
    </TouchableOpacity>
  );
};

export default ActionButton;
