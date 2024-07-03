// src/hooks/useAuth.tsx
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, } from '../context/AuthContext';

const useAuth = () => {
  const { userId, token, loading, login, logout, roles, error, isAuthenticated, register } = useContext(AuthContext) ?? {};
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (token) {
        setIsAuthenticatedState(true);
        if (userId) {
          console.log('User is authenticated', userId);
        }
      } else {
        setIsAuthenticatedState(false);
        navigate('/login');
      }
    }
  }, [token, userId, loading, navigate]);

  return {
    userId,
    token,
    loading,
    isAuthenticated: isAuthenticatedState,
    login,
    logout,
    roles,
    error,
    register,
  };
};

export default useAuth;
