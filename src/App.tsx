import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './auth/register'; // Ensure this path is correct
import Login from './auth/login';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Logout from './auth/logout';
import HomePage from './page/HomePage';

const PrivateRoute = ({ component: Component }: { component: React.ComponentType }) => {
  const { token } = useContext(AuthContext) ?? {};
  console.log('Token in PrivateRoute:', token);
  return token ? <Component /> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login handleLogin={function (): Promise<void> {
            throw new Error('Function not implemented.');} }  />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<PrivateRoute component={HomePage} />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

