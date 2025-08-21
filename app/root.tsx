import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import UserProvider from './context/UserContext';
import { getUserToken } from './utils/userToken';
import type { UserInitialValues } from './utils/types';
import './root.css';

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
    isLoggedIn: false,
    user: null,
    expiresAt: initUserToken?.expiry || null,
    accessToken: initUserToken?.value || '',
    applicationKey: null,
  };

  return (
    <UserProvider initialValues={userInitialValues}>
      <div className="App">
        <Outlet />
      </div>
    </UserProvider>
  );
}