import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { dataService } from '../services/dataService';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => User | null;
  logout: () => void;
  isLoading: boolean;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const current = dataService.getCurrentUser();
    setUser(current);
    setIsLoading(false);
  }, []);

  const login = (email: string, pass: string) => {
    const authenticatedUser = dataService.login(email, pass);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      return authenticatedUser;
    }
    return null;
  };

  const logout = () => {
    dataService.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    dataService.updateUser(updatedUser);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
