import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { BrandLogo } from './common/BrandLogo';
import { ActionButton } from './common/ActionButton';
import { ScreenHeader } from './common/ScreenHeader';
import { PasswordInput } from './common/PasswordInput';

interface SignUpScreenProps {
  onBack: () => void;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onBack,
  onSuccess,
  onSwitchToLogin,
}) => {
  const { signUp } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [balance, setBalance] = useState('1000.00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [accountType, setAccountType] = useState<'CONSUMER' | 'MERCHANT'>('CONSUMER');
  const [currency, setCurrency] = useState('USD');

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];

  const handleSignUp = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await signUp(username.trim(), password, parseFloat(balance) || 0, currency, accountType);
      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <View className="flex-1 px-5 pt-4">
        <ScreenHeader title="Create Account" onBack={onBack} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}>
          {/* Brand */}
          <View className="items-center mt-4 mb-8">
            <BrandLogo size="lg" />
            <Text className="text-sky-500 font-black text-2xl mt-4 tracking-wider">
              Q<Text className="text-slate-900 font-light">PAY</Text>
            </Text>
          </View>

          {/* Error Banner */}
          {error && (
            <View className="bg-red-900/40 border border-red-500/60 rounded-2xl px-4 py-3 mb-4">
              <Text className="text-red-300 text-sm font-semibold">{error}</Text>
            </View>
          )}

          {/* Form Card */}
          <View className="bg-white border border-slate-200 rounded-3xl p-5 mb-6 gap-4">
            {/* Account Type Selector */}
            <View>
              <Text className="text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">Account Type</Text>
              <View className="flex-row bg-slate-50 p-1.5 rounded-2xl border border-slate-200 space-x-2">
                <TouchableOpacity
                  onPress={() => setAccountType('CONSUMER')}
                  className={`flex-1 py-2.5 rounded-xl items-center ${accountType === 'CONSUMER' ? 'bg-sky-500/20 border border-sky-500/50' : ''}`}
                >
                  <Text className={`text-xs font-bold ${accountType === 'CONSUMER' ? 'text-sky-500' : 'text-slate-500'}`}>
                    Consumer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAccountType('MERCHANT')}
                  className={`flex-1 py-2.5 rounded-xl items-center ${accountType === 'MERCHANT' ? 'bg-sky-500/20 border border-sky-500/50' : ''}`}
                >
                  <Text className={`text-xs font-bold ${accountType === 'MERCHANT' ? 'text-sky-500' : 'text-slate-500'}`}>
                    Merchant
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Currency Selector */}
            <View>
              <Text className="text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">Base Currency</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {currencies.map((cur) => (
                  <TouchableOpacity
                    key={cur}
                    onPress={() => setCurrency(cur)}
                    className={`px-4 py-2.5 rounded-xl mr-2 border ${
                      currency === cur
                        ? 'bg-sky-500/20 border-sky-500/50'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text className={`text-xs font-bold ${currency === cur ? 'text-sky-500' : 'text-slate-500'}`}>
                      {cur}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Username */}
            <View>
              <Text className="text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">Username</Text>
              <TextInput
                id="signup-username"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter a username"
                placeholderTextColor="#475569"
                autoCapitalize="none"
                autoCorrect={false}
                className="bg-slate-50 border border-slate-200 text-slate-900 font-medium text-base px-4 py-3.5 rounded-2xl"
              />
            </View>

            {/* Password */}
            <PasswordInput
              id="signup-password"
              value={password}
              onChangeText={setPassword}
              placeholder="Minimum 6 characters"
            />

            {/* Starting Balance (For demo purposes) */}
            <View>
              <Text className="text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
                Starting Balance ($) <Text className="text-sky-500/60 font-normal normal-case tracking-normal">— demo only</Text>
              </Text>
              <TextInput
                id="signup-balance"
                value={balance}
                onChangeText={setBalance}
                placeholder="1000.00"
                placeholderTextColor="#475569"
                keyboardType="numeric"
                className="bg-slate-50 border border-sky-500/30 text-sky-500 font-bold text-base px-4 py-3.5 rounded-2xl"
              />
            </View>
          </View>

          {/* Submit Button */}
          {isLoading ? (
            <View className="w-full py-4 bg-sky-500/50 rounded-2xl items-center justify-center">
              <ActivityIndicator color="#070A11" />
            </View>
          ) : (
            <ActionButton label="Create Account" variant="primary" onPress={handleSignUp} />
          )}

          {/* Switch to Login */}
          <TouchableOpacity onPress={onSwitchToLogin} className="items-center mt-5">
            <Text className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Text className="text-sky-500 font-bold">Log In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
