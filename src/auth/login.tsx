// src/auth/Login.tsx
import React from "react";
import { useNavigate } from 'react-router-dom';
import LoginComponent from '../components/LoginComponent';
import useAuth from '../hooks/useAuth';
import { UserData } from '../types/UserData';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (userData: UserData) => {
    try {
      if (login) {
        await login(userData.email, userData.password);
        navigate('/home');
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <LoginComponent handleLogin={handleLogin} />
    </div>
  );
};

export default Login;

