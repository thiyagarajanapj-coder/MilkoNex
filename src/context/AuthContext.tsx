import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../lib/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role?: 'admin'|'worker') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('farm_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, role: 'admin'|'worker' = 'admin') => {
    const newUser: User = {
      id: 'USER-1',
      name: email.split('@')[0],
      email,
      phone: '1234567890',
      role,
      farmId: 'FARM-1'
    };
    setUser(newUser);
    localStorage.setItem('farm_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('farm_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
