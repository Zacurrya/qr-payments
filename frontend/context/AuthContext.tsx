import React, { createContext, useCallback, useEffect, useState } from 'react';
import authService, { AuthSession } from '../services/authService';

// Types
export interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  signUp: (username: string, password: string, initialBalance: number, currency?: string, accountType?: 'CONSUMER' | 'MERCHANT') => Promise<void>;
  logIn: (username: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateSession: (updates: Partial<AuthSession>) => Promise<void>;
}

// Context
export const AuthContext = createContext<AuthContextValue | null>(null);

// Provider
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore persisted session from AsyncStorage
  useEffect(() => {
    authService.loadSession().then((stored) => {
      setSession(stored);
      setIsLoading(false);
    });
  }, []);

  const signUp = useCallback(
    async (username: string, password: string, initialBalance: number, currency: string = 'USD', accountType: 'CONSUMER' | 'MERCHANT' = 'CONSUMER') => {
      const s = await authService.signUp(username, password, initialBalance, currency, accountType);
      setSession(s);
    },
    []
  );

  const logIn = useCallback(async (username: string, password: string) => {
    const s = await authService.logIn(username, password);
    setSession(s);
  }, []);

  const logOut = useCallback(async () => {
    await authService.logOut();
    setSession(null);
  }, []);

  const updateSession = useCallback(async (updates: Partial<AuthSession>) => {
    const updated = await authService.updateSession(updates);
    if (updated) {
      setSession(updated);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading, signUp, logIn, logOut, updateSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
