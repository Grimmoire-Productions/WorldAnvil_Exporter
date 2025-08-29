import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import { useEffect, useContext, useState } from 'react';
import UserProvider from '~/context/UserContext';
import { UserContext } from '~/context/UserContext';
import { useLogin } from '~/hooks/useLogin';
import { getUserToken } from '~/utils/userToken';
import type { UserInitialValues, UserContextType } from '~/utils/types';
import './root.css';

function AppWithAutoLogin({ children }: { children: React.ReactNode }) {
  const { user, accessToken, expiresAt, applicationKey, isLoggedIn, setIsLoggedIn, setAccessToken, setUser, setExpiresAt } = useContext(UserContext) as UserContextType;
  const { login } = useLogin();
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);

  // Auto-login effect using the same logic as login.tsx
  useEffect(() => {
    if (accessToken && expiresAt && !user && isLoggedIn && !isAutoLoggingIn) {
      console.log('Root: Starting auto-login');
      setIsAutoLoggingIn(true);
      const appKey = applicationKey || undefined;
      login(accessToken, appKey)
        .then(() => {
          console.log('Root: Auto-login successful');
        })
        .catch((err) => {
          console.error('Root: Auto-login failed:', err);
          // Clear invalid session
          setIsLoggedIn(false);
          setAccessToken('');
          setUser(null);
          setExpiresAt(null);
        })
        .finally(() => {
          setIsAutoLoggingIn(false);
        });
      
      // Set up timeout for token expiration
      const timeRemaining = expiresAt - Date.now();
      const timeout = setTimeout(() => {
        alert("Authentication timeout, please log in again");
        setAccessToken('');
        setUser(null);
        setIsLoggedIn(false);
        setExpiresAt(null);
      }, timeRemaining);
      
      return () => clearTimeout(timeout);
    }
  }, [accessToken, expiresAt, user, isLoggedIn, applicationKey, login, setIsLoggedIn, setAccessToken, setUser, setExpiresAt, isAutoLoggingIn]);

  return <>{children}</>;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Website for exporting character sheets from WA into html sheets"
        />
        <title>World Anvil Exporter</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <div>Loading application...</div>;
}

export default function App() {
  const initUserToken = getUserToken();

  const userInitialValues: UserInitialValues = {
    isLoggedIn: !!initUserToken?.value,
    user: null,
    expiresAt: initUserToken?.expiry || null,
    accessToken: initUserToken?.value || '',
    applicationKey: null,
  };

  return (
    <UserProvider initialValues={userInitialValues}>
      <AppWithAutoLogin>
        <div className="App">
          <Outlet />
        </div>
      </AppWithAutoLogin>
    </UserProvider>
  );
}