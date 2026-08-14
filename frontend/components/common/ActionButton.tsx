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
    ? 'bg-sky-500 border border-sky-400 shadow-xl shadow-sky-500/20 active:bg-sky-600'
    : 'bg-white border-2 border-sky-500/60 active:bg-slate-100';

  const textClass = isPrimary
    ? 'text-white font-black'
    : 'text-sky-500 font-bold';

  const subtextClass = isPrimary
    ? 'text-slate-600 font-semibold'
    : 'text-slate-500 font-semibold';

  const widthClass = className.includes('w-') ? '' : 'w-full';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      className={`${widthClass} py-4 px-4 rounded-2xl items-center justify-center space-y-1 ${containerClass} ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {icon && (
        <View className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${isPrimary ? 'bg-slate-50/20' : 'bg-sky-500/20 border border-sky-500/40'}`}>
          <Text className={`font-black text-xl ${isPrimary ? 'text-white' : 'text-sky-500'}`}>{icon}</Text>
        </View>
      )}
      <Text className={`${textClass} text-base tracking-wide uppercase`}>{label}</Text>
      {sublabel && <Text className={`${subtextClass} text-xs`}>{sublabel}</Text>}
    </TouchableOpacity>
  );
};

export default ActionButton;
