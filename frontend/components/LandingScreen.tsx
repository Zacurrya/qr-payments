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
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        className="px-6"
      >
        {/* Hero Brand Section */}
        <View className="items-center mb-12">
          {/* <BrandLogo size="lg" /> */}
          <Text className="text-sky-500 font-black text-6xl mt-6 mb-2 tracking-wider">
            Q<Text className="text-slate-900 font-light">Pay</Text>
          </Text>
        </View>

        {/* Hero Copy */}
        <View className="mb-10 items-center">
          <Text className="text-slate-900 text-2xl font-light text-center leading-snug mb-3">
            The payment system for <Text className="text-sky-500">everyone</Text>
          </Text>
        </View>

        {/* Auth Buttons */}
        <View className="space-y-3 mt-6 gap-6 px-8">
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
