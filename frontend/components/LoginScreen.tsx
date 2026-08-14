import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { BrandLogo } from './common/BrandLogo';
import { ActionButton } from './common/ActionButton';
import { ScreenHeader } from './common/ScreenHeader';
import { PasswordInput } from './common/PasswordInput';

interface LoginScreenProps {
  onBack: () => void;
  onSuccess: () => void;
  onSwitchToSignUp: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onBack,
  onSuccess,
  onSwitchToSignUp,
}) => {
  const { logIn } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await logIn(username.trim(), password);
      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-midnight-950">
      <StatusBar barStyle="light-content" backgroundColor="#070A11" />
      <View className="flex-1 px-5 pt-4">
        <ScreenHeader title="Sign In" onBack={onBack} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 64 }}>
          {/* Brand */}
          <View className="items-center mt-4 mb-8">
            <BrandLogo size="lg" />
            <Text className="text-gold-300 font-black text-2xl mt-4 tracking-wider">
              Q<Text className="text-slate-100 font-light">PAY</Text>
            </Text>
          </View>

          {/* Error Banner */}
          {error && (
            <View className="bg-red-900/40 border border-red-500/60 rounded-2xl px-4 py-3 mb-4">
              <Text className="text-red-300 text-sm font-semibold">{error}</Text>
            </View>
          )}

          {/* Form Card */}
          <View className="bg-midnight-900 border border-gold-500/60 rounded-3xl p-5 mb-12 gap-4">
            {/* Username */}
            <View>
              <Text className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">Username</Text>
              <TextInput
                id="login-username"
                value={username}
                onChangeText={setUsername}
                placeholder="Your username"
                placeholderTextColor="#475569"
                autoCapitalize="none"
                autoCorrect={false}
                className="bg-midnight-950 border border-midnight-800 text-slate-100 font-medium text-base px-4 py-3.5 rounded-2xl"
              />
            </View>

            {/* Password */}
            <PasswordInput
              id="login-password"
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
            />
          </View>

          {/* Submit Button */}
          {isLoading ? (
            <View className="w-full py-4 bg-gold-500/50 rounded-2xl items-center justify-center">
              <ActivityIndicator color="#070A11" />
            </View>
          ) : (
            <ActionButton label="Log In" variant="primary" onPress={handleLogin} />
          )}

          {/* Switch to SignUp */}
          <TouchableOpacity onPress={onSwitchToSignUp} className="items-center mt-5">
            <Text className="text-slate-400 text-sm">
              No account yet?{' '}
              <Text className="text-gold-300 font-bold">Create one</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
