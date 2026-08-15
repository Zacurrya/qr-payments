import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { AppSplashScreen } from '../components/common/AppSplashScreen';
import LandingScreen from '../components/LandingScreen';

export default function Index() {
  const { session, isLoading } = useAuth();

  if (isLoading) return <AppSplashScreen />;
  if (session) return <Redirect href="/(app)/home" />;

  return <LandingScreen />;
}
