import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

// Define the type for the decoded token
interface DecodedToken {
  id: string;
  roles: string[];
}

// Define the return type for the hook
interface UseTokenReturn {
  userId: string | null;
  userRoles: string[] | null;
}

const useToken = (): UseTokenReturn => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          const decodedToken = jwtDecode<DecodedToken>(storedToken);
          setUserId(decodedToken.id);
          setUserRoles(decodedToken.roles);
        } else {
          console.error('No token found in localStorage');
        }
      } catch (error) {
        console.error('Failed to fetch or decode token:', error);
      }
    };

    fetchToken();
  }, []);

  return { userId, userRoles };
};

export default useToken;



