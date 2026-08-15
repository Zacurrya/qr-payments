import React from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { QPayLogo } from './common/QPayLogo';
import { ActionButton } from './common/ActionButton';

export const LandingScreen: React.FC = () => {
  const router = useRouter();

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
        <QPayLogo size="xl" showSubtitle={true} className="mb-6" />

        {/* Hero Copy */}
        <View className="mb-8 items-center">
          <Text className="text-slate-900 text-xl font-bold text-center leading-snug mb-2">
            The payment system for <Text className="text-sky-500">all</Text>
          </Text>
        </View>

        {/* Auth Buttons */}
        <View className="space-y-3 gap-4 px-8">
          <ActionButton
            label="Log In"
            variant="secondary"
            onPress={() => router.push('/(auth)/login')}
          />
          <ActionButton
            label="Create Account"
            variant="primary"
            onPress={() => router.push('/(auth)/signup')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LandingScreen;
