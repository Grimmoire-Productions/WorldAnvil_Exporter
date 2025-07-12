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
  const [expiresAt, setExpiresAt] = useState(initialValues.expiresAt);
  const [applicationKey, setApplicationKey] = useState(initialValues.applicationKey);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        accessToken,
        setAccessToken,
        expiresAt,
        setExpiresAt,
        applicationKey,
        setApplicationKey,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;