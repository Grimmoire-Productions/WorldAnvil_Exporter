import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { useEffect, useContext, useRef } from "react";
import UserProvider from "~/context/UserContext/UserProvider";
import { UserContext } from "~/context/UserContext/UserContext";
import { useLogin } from "~/hooks/useLogin";
import { getUserToken } from "~/utils/userToken";
import type { UserInitialValues, UserContextType } from "~/utils/types";
import "./root.css";

function AppWithAutoLogin({ children }: { children: React.ReactNode }) {
  const {
    user,
    accessToken,
    expiresAt,
    applicationKey,
    isLoggedIn,
    setIsLoggedIn,
    setAccessToken,
    setUser,
    setExpiresAt,
    isAutoLoginPending,
    setIsAutoLoginPending,
    isAutoLoginInProgress,
    setIsAutoLoginInProgress,
  } = useContext(UserContext) as UserContextType;
  const { login } = useLogin();
  const autoLoginAttempted = useRef(false);

  // Auto-login effect using the same logic as login.tsx
  useEffect(() => {
    if (
      accessToken &&
      expiresAt &&
      !user &&
      isLoggedIn &&
      isAutoLoginPending &&
      !autoLoginAttempted.current
    ) {
      autoLoginAttempted.current = true;
      setIsAutoLoginInProgress(true);
      setIsAutoLoginPending(false);
      const appKey = applicationKey || undefined;
      login(accessToken, appKey)
        .catch((err) => {
          console.error("Root: Auto-login failed:", err);
          // Clear invalid session
          setIsLoggedIn(false);
          setAccessToken("");
          setUser(null);
          setExpiresAt(null);
          autoLoginAttempted.current = false; // Allow retry on failure
        })
        .finally(() => {
          setIsAutoLoginInProgress(false);
        });

      // Set up timeout for token expiration
      const timeRemaining = expiresAt - Date.now();
      const timeout = setTimeout(() => {
        alert("Authentication timeout, please log in again");
        setAccessToken("");
        setUser(null);
        setIsLoggedIn(false);
        setExpiresAt(null);
      }, timeRemaining);

      return () => clearTimeout(timeout);
    }
  }, [
    accessToken,
    expiresAt,
    user,
    isLoggedIn,
    applicationKey,
    login,
    setIsLoggedIn,
    setAccessToken,
    setUser,
    setExpiresAt,
    isAutoLoginPending,
    setIsAutoLoginPending,
    isAutoLoginInProgress,
    setIsAutoLoginInProgress,
  ]);

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
    accessToken: initUserToken?.value || "",
    applicationKey: null,
    isAutoLoginPending: !!initUserToken?.value, // true if we have a token (will need auto-login)
    isAutoLoginInProgress: false,
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
