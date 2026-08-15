import './global.css';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './context/AuthContext';
import { ColorProvider } from './context/ColorContext';
import { useFonts, Dongle_300Light, Dongle_400Regular, Dongle_700Bold } from '@expo-google-fonts/dongle';
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
import { AppSplashScreen } from './components/common/AppSplashScreen';

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

  // Show a loading splash screen while AsyncStorage is being read
  if (isLoading) {
    return <AppSplashScreen />;
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

export default function App() {
  const [fontsLoaded] = useFonts({
    Dongle_300Light,
    Dongle_400Regular,
    Dongle_700Bold,
  });

  if (!fontsLoaded) {
    return <AppSplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ColorProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </ColorProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
