import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Dongle_300Light, Dongle_400Regular, Dongle_700Bold } from '@expo-google-fonts/dongle';
import { AuthProvider } from '../context/AuthContext';
import { ColorProvider } from '../context/ColorContext';
import { AppSplashScreen } from '../components/common/AppSplashScreen';

export default function RootLayout() {
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
          <Stack screenOptions={{ headerShown: false }} />
        </ColorProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
