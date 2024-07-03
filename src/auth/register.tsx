// src/auth/register.tsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterComponent from '../components/RegisterComponent';
import { AuthContext } from '../context/AuthContext';
import { UserData } from '../types/UserData';

const Inscription: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext) || {};

  const handleRegister = async (userData: UserData) => {
    try {
      if (register) {
        await register(userData.email, userData.password);
      }
      navigate('/home');
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div>
      <RegisterComponent handleRegister={handleRegister} />
    </div>
  );
};

export default Inscription;


