import React from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandLogo } from './common/BrandLogo';
import { ActionButton } from './common/ActionButton';

interface LandingScreenProps {
  onSignUp: () => void;
  onLogIn: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onSignUp, onLogIn }) => {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 relative overflow-hidden">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Ambient Decorative Gradient Orbs */}
      <View className="absolute -top-24 -right-24 w-80 h-80 bg-sky-500/10 rounded-full" style={{ zIndex: -1 }} />
      <View className="absolute top-1/3 -left-28 w-72 h-72 bg-indigo-500/10 rounded-full" style={{ zIndex: -1 }} />
      <View className="absolute -bottom-20 right-10 w-64 h-64 bg-emerald-500/10 rounded-full" style={{ zIndex: -1 }} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 40 }}
        showsVerticalScrollIndicator={false}
        className="px-6"
      >
        {/* Hero Brand Section */}
        <View className="items-center mb-6">
          <Text className="text-sky-500 font-black text-6xl tracking-tighter">
            Q<Text className="text-slate-900 font-extrabold">pay</Text>
          </Text>
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">
            QR Payment Demo
          </Text>
        </View>

        {/* Hero Copy */}
        <View className="mb-8 items-center px-4">
          <Text className="text-slate-900 text-2xl font-bold text-center leading-snug mb-2">
            The payment system for <Text className="text-sky-500">everyone</Text>
          </Text>
        </View>

        {/* Auth Buttons */}
        <View className="space-y-3 gap-4 px-4">
          <ActionButton
            label="Create Account"
            variant="primary"
            onPress={onSignUp}
          />
          <ActionButton
            label="Log In"
            variant="secondary"
            onPress={onLogIn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LandingScreen;
