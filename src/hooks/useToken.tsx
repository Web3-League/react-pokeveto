import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface DecodedToken {
  id: string;
  roles: string[];
}

interface UseTokenReturn {
  userId: string | null;
  userRoles: string[] | null;
  isAuthenticated: boolean;
}

const useToken = (): UseTokenReturn => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[] | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = Cookies.get('token');
        console.log('Stored token:', storedToken); // Debug: Check token value

        if (storedToken) {
          const decodedToken = jwtDecode<DecodedToken>(storedToken);
          console.log('Decoded token:', decodedToken); // Debug: Check decoded token

          setUserId(decodedToken.id);
          setUserRoles(decodedToken.roles);
          setIsAuthenticated(true); // Set authenticated state
        } else {
          console.error('No token found in cookies');
          setIsAuthenticated(false); // Set unauthenticated state
        }
      } catch (error) {
        console.error('Failed to fetch or decode token:', error);
        setIsAuthenticated(false); // Set unauthenticated state on error
      }
    };

    fetchToken();
  }, []);

  return { userId, userRoles, isAuthenticated };
};

export default useToken;

