import React from 'react';
import useToken from '../hooks/useToken';

const UserProfile = () => {
  const { userId, userRoles } = useToken();
  return (
    <div>
      <p>User ID: {userId}</p>
      <p>User Roles: {userRoles}</p>
      {/* Additional UI components */}
    </div>
  );
};

export default UserProfile;

