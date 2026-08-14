import './global.css';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { useNavigationFlow } from './hooks/useNavigationFlow';

import LandingScreen from './components/LandingScreen';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import HomeScreen from './components/HomeScreen';
import SendMoneyScreen from './components/SendMoneyScreen';
import TransferAmountScreen from './components/TransferAmountScreen';
import ReceiveMoneyScreen from './components/ReceiveMoneyScreen';
import AllTransactionsScreen from './components/AllTransactionsScreen';

// ─── Inner navigator (must be inside AuthProvider to use useAuth) ─────────────

const AppNavigator: React.FC = () => {
  const { session, isLoading, logOut } = useAuth();

  const {
    currentScreen,
    recipient,
    navigateToHome,
    navigateToSend,
    navigateToTransfer,
    navigateToReceive,
    navigateToLogin,
    navigateToSignUp,
    navigateToAllTransactions,
    handleScanSuccess,
  } = useNavigationFlow();

  // Show a loading spinner while AsyncStorage is being read
  if (isLoading) {
    return (
      <View className="flex-1 bg-midnight-950 items-center justify-center">
        <ActivityIndicator color="#D4AF37" size="large" />
      </View>
    );
  }

  // ── Unauthenticated flow ────────────────────────────────────────────────────
  if (!session) {
    if (currentScreen === 'login') {
      return (
        <LoginScreen
          onBack={navigateToHome}
          onSuccess={navigateToHome}
          onSwitchToSignUp={navigateToSignUp}
        />
      );
    }
    if (currentScreen === 'signup') {
      return (
        <SignUpScreen
          onBack={navigateToHome}
          onSuccess={navigateToHome}
          onSwitchToLogin={navigateToLogin}
        />
      );
    }
    // Default unauthenticated: Landing
    return (
      <LandingScreen
        onSignUp={navigateToSignUp}
        onLogIn={navigateToLogin}
      />
    );
  }

  // ── Authenticated flow ──────────────────────────────────────────────────────
  if (currentScreen === 'send') {
    return (
      <SendMoneyScreen
        onBack={navigateToHome}
        onScanSuccess={handleScanSuccess}
      />
    );
  }

  if (currentScreen === 'transfer') {
    return (
      <TransferAmountScreen
        recipientName={recipient.recipientName}
        accountId={recipient.accountId}
        initialAmount={recipient.amount || '50'}
        onBack={navigateToSend}
        onConfirmSuccess={navigateToHome}
      />
    );
  }

  if (currentScreen === 'receive') {
    return (
      <ReceiveMoneyScreen
        onBack={navigateToHome}
      />
    );
  }

  if (currentScreen === 'all_transactions') {
    return (
      <AllTransactionsScreen onBack={navigateToHome} />
    );
  }

  // Default authenticated: Home
  return (
    <HomeScreen
      onShowAllTransactions={navigateToAllTransactions}
      onSendMoney={navigateToSend}
      onReceivePayment={navigateToReceive}
      onLogOut={logOut}
    />
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
