import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const context = useContext(AuthContext);
  console.log(context);
  const storedToken = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    if (storedToken)
      localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;