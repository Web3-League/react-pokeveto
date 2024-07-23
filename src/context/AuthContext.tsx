// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { useCookies } from 'react-cookie';

interface AuthContextProps {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  roles: string[] | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [roles, setRoles] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = cookies.token;
        console.log('Stored token:', storedToken);
        if (storedToken && typeof storedToken === 'string') {
          const decodedToken: any = jwtDecode(storedToken);
          setToken(storedToken);
          setUserId(decodedToken.id);
          setRoles(decodedToken.roles);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Initialization error:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [cookies.token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8083/api/auth/login', { email, password });
      console.log('Login response data:', response.data);

      if (!response.data || typeof response.data !== 'object' || !response.data.token) {
        throw new Error('Invalid response data format');
      }

      const { token } = response.data;
      const decodedToken: any = jwtDecode(token);
      const expires = new Date();
      expires.setDate(expires.getDate() + 1); // 1 day expiry

      setCookie('token', token, {
        expires,
        path: '/',  // Ensure cookie is accessible in the whole site
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict',
      });

      setToken(token);
      setUserId(decodedToken.id);
      setRoles(decodedToken.roles);
      setIsAuthenticated(true);
      setError(null);
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response ? error.response.data.message : 'Login failed');
      throw new Error(error.response ? error.response.data.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8083/api/auth/register', { email, password });
      console.log('Register response data:', response.data);

      if (!response.data || typeof response.data !== 'object' || !response.data.token) {
        throw new Error('Invalid response data format');
      }

      const { token } = response.data;
      const decodedToken: any = jwtDecode(token);
      const expires = new Date();
      expires.setDate(expires.getDate() + 1); // 1 day expiry

      setCookie('token', token, {
        expires,
        path: '/',  // Ensure cookie is accessible in the whole site
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict',
      });

      setToken(token);
      setUserId(decodedToken.id);
      setRoles(decodedToken.roles);
      setIsAuthenticated(true);
      setError(null);
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.response ? error.response.data.message : 'Registration failed');
      throw new Error(error.response ? error.response.data.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8083/api/auth/logout');
      removeCookie('token', { path: '/' });
      setToken(null);
      setUserId(null);
      setRoles(null);
      setIsAuthenticated(false);
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        isAuthenticated,
        loading,
        error,
        roles,
        login,
        logout,
        register,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

