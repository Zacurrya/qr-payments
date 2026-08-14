import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  label = 'Password', 
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <Text className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">{label}</Text>
      <View className="flex-row items-center bg-midnight-950 border border-midnight-800 rounded-2xl pr-2">
        <TextInput
          {...props}
          placeholderTextColor="#475569"
          secureTextEntry={!showPassword}
          className="flex-1 text-slate-100 font-medium text-base px-4 py-3.5"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2">
          <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#475569" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
