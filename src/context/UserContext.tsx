import React, { createContext, useState } from 'react';
import type { UserContextType, UserInitialValues } from '../utils/types';

export const UserContext = createContext<UserContextType | null>(null);

const UserProvider: React.FC<{
  initialValues: UserInitialValues;
  children: React.ReactNode;
}> = ({ initialValues, children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initialValues.isLoggedIn);
  const [accessToken, setAccessToken] = useState(initialValues.accessToken);
  const [user, setUser] = useState(initialValues.user);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;