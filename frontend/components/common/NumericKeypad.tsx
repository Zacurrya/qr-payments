import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({ onKeyPress }) => {
  const rows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', '⌫'],
  ];

  return (
    <View className="bg-white border border-slate-200 rounded-3xl p-4 mb-6">
      {rows.map((row, rIdx) => (
        <View key={rIdx} className="flex-row my-1.5">
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              activeOpacity={0.7}
              onPress={() => onKeyPress(key)}
              className="flex-1 py-4 mx-1.5 bg-slate-50 border border-slate-200/80 rounded-2xl items-center justify-center active:bg-sky-500/20 shadow-sm"
            >
              <Text className="text-slate-900 font-bold text-xl">{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

export default NumericKeypad;
