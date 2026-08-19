import { createContext, useContext, useState, useCallback } from 'react';
import { login as loginRequest } from '../api/auth';
import { setToken, getToken } from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('office-app-user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (username, password) => {
    const { token, user: loggedInUser } = await loginRequest(username, password);
    setToken(token);
    localStorage.setItem('office-app-user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('office-app-user');
    setUser(null);
  }, []);

  const isAuthenticated = Boolean(user && getToken());

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
