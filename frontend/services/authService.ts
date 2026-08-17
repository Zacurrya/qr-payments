import AsyncStorage from '@react-native-async-storage/async-storage';

const configuredApiBase = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');
export const API_BASE = configuredApiBase || 'http://localhost:8088';
export const AUTH_API = `${API_BASE}/api/v1/auth`;
const AUTH_SESSION_KEY = 'QPay_session';

export interface AuthSession {
  accessToken: string;
  userId: string;
  username: string;
  accountId: string;
  accountType?: 'CONSUMER' | 'MERCHANT';
  balance: string;
  currency: string;
}

const authService = {
  signUp: async (
    username: string,
    password: string,
    initialBalance: number,
    currency: string = 'USD',
    accountType: 'CONSUMER' | 'MERCHANT' = 'CONSUMER'
  ): Promise<AuthSession> => {
    const res = await fetch(`${AUTH_API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, initialBalance, currency, accountType }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Registration failed');
    }
    const data = await res.json();
    const session: AuthSession = {
      accessToken: data.accessToken,
      userId: data.userId,
      username: data.username,
      accountId: data.accountId,
      accountType: data.accountType,
      balance: data.balance,
      currency: data.currency,
    };
    await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    return session;
  },

  logIn: async (username: string, password: string): Promise<AuthSession> => {
    const res = await fetch(`${AUTH_API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Invalid credentials');
    }
    const data = await res.json();
    const session: AuthSession = {
      accessToken: data.accessToken,
      userId: data.userId,
      username: data.username,
      accountId: data.accountId,
      accountType: data.accountType,
      balance: data.balance,
      currency: data.currency,
    };
    await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    return session;
  },

  logOut: async (): Promise<void> => {
    await AsyncStorage.removeItem(AUTH_SESSION_KEY);
  },

  loadSession: async (): Promise<AuthSession | null> => {
    const raw = await AsyncStorage.getItem(AUTH_SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  },

  updateSession: async (updates: Partial<AuthSession>): Promise<AuthSession | null> => {
    const raw = await AsyncStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const current = JSON.parse(raw) as AuthSession;
    const updated = { ...current, ...updates };
    await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updated));
    return updated;
  },
};

export default authService;
