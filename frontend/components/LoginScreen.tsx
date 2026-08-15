import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { ActionButton } from './common/ActionButton';
import { ScreenHeader } from './common/ScreenHeader';
import { PasswordInput } from './common/PasswordInput';
import { QPayLogo } from './common/QPayLogo';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
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
      router.replace('/(app)/home');
    } catch (e: any) {
      setError(e.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <View className="flex-1 px-5 pt-4">
        <ScreenHeader title="Sign In" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 64 }}>
          {/* Brand */}
          <QPayLogo size="lg" showSubtitle={true} className="mt-2 mb-6" />

          {/* Error Banner */}
          {error && (
            <View className="bg-red-900/40 border border-red-500/60 rounded-2xl px-4 py-3 mb-4">
              <Text className="text-red-300 text-sm font-semibold">{error}</Text>
            </View>
          )}

          {/* Form Card */}
          <View className="bg-white border border-sky-500/60 rounded-3xl p-5 mb-12 gap-4">
            {/* Username */}
            <View>
              <Text className="text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">Username</Text>
              <TextInput
                id="login-username"
                value={username}
                onChangeText={setUsername}
                placeholder="Your username"
                placeholderTextColor="#475569"
                autoCapitalize="none"
                autoCorrect={false}
                className="bg-slate-50 border border-slate-200 text-slate-900 font-medium text-base px-4 py-3.5 rounded-2xl"
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
          <View className="items-center w-full">
            {isLoading ? (
              <View className="w-4/5 max-w-sm py-4 bg-sky-500/50 rounded-2xl items-center justify-center">
                <ActivityIndicator color="#ffffff" />
              </View>
            ) : (
              <ActionButton
                label="Log In"
                variant="primary"
                onPress={handleLogin}
                className="w-4/5 max-w-sm py-3.5"
              />
            )}
          </View>

          {/* Switch to SignUp */}
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')} className="items-center mt-5">
            <Text className="text-slate-500 text-sm">
              No account yet?{' '}
              <Text className="text-sky-500 font-bold">Create one</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
