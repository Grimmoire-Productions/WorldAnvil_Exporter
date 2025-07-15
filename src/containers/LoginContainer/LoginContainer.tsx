import React, { useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import type { UserContextType } from '../../utils/types.ts';
import backendAPI from '../../utils/backendAPI.ts';
import LoginBar from '../../components/LoginBar/LoginBar.tsx';
import styles from './LoginContainer.module.css';

function LoginContainer() {
  const {
    setIsLoggedIn,
    setUser,
    accessToken,
    setAccessToken,
    expiresAt,
    setExpiresAt,
    applicationKey,
    setApplicationKey,
  } = React.useContext(UserContext) as UserContextType;
  
  const [needsApplicationKey, setNeedsApplicationKey] = useState(true);

  useEffect(() => {
    if (accessToken !== '' && expiresAt) {
      login(accessToken);
      const timeRemaining = expiresAt - Date.now();
      const timeout = setTimeout(() => {
        alert('Authentication timeout, please log in again');
        setAccessToken('');
        setUser(null);
        setIsLoggedIn(false);
        setExpiresAt(null);
      }, timeRemaining);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [accessToken, expiresAt]);

  const handleAccessTokenChange = (e: React.FormEvent<HTMLInputElement>) =>
    setAccessToken(e.currentTarget.value);

  useEffect(() => {
    backendAPI.checkCredentials().then((response) => {
      setNeedsApplicationKey(!response.hasAppKey);
    });
  }, []);
    
  const handleApplicationKeyChange = (e: React.FormEvent<HTMLInputElement>) =>
    setApplicationKey(e.currentTarget.value);

  const login = async (accessToken: string) => {
    try {
      // Only send appKey if user provided it
      const appKey = applicationKey || undefined;
      const userResponse = await backendAPI.logIn(accessToken, appKey);
      if (userResponse.displayName) {
        const worlds = await backendAPI.getWorlds(userResponse.id)
        const user = userResponse;
        user.worlds = worlds;
        setUser(user);
        setIsLoggedIn(true)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (accessToken === '') {
      console.log('error: Access token is required')
      return;
    }
    
    if (needsApplicationKey && !applicationKey) {
      console.log('error: Application key is required')
      return;
    }

    login(accessToken)

    return;
  };

  return (
    <div id="login" className={styles.login} data-testid="login-container">
      <header>
        <h1>World Anvil Character Sheet Export Tool</h1>
      </header>
      <main>
        <LoginBar
          accessToken={accessToken}
          onLogin={handleLogin}
          onUpdateAccessToken={handleAccessTokenChange}
          needsApplicationKey={needsApplicationKey}
          applicationKey={applicationKey}
          onUpdateApplicationKey={handleApplicationKeyChange}
        />
      </main>
      <footer>
        <p>Grimmoire Productions 2024</p>
      </footer>
    </div>
  );
}

export default LoginContainer;