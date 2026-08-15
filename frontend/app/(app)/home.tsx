import { Redirect } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { AppSplashScreen } from '../../components/common/AppSplashScreen';
import HomeScreen from '../../components/HomeScreen';

export default function HomeRoute() {
  const { session, isLoading } = useAuth();

  if (isLoading) return <AppSplashScreen />;
  if (!session) return <Redirect href="/" />;

  return <HomeScreen />;
}
