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
    <View className="bg-midnight-900 border border-midnight-800 rounded-3xl p-4 mb-6 space-y-2">
      {rows.map((row, rIdx) => (
        <View key={rIdx} className="flex-row space-x-2">
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => onKeyPress(key)}
              className="flex-1 py-3.5 bg-midnight-950 border border-midnight-800/80 rounded-2xl items-center justify-center active:bg-gold-500/20"
            >
              <Text className="text-slate-100 font-bold text-xl">{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

export default NumericKeypad;
