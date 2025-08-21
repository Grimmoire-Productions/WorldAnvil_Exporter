import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../context/UserContext';
import type { UserContextType } from '../../utils/types';
import backendAPI from '../../utils/backendAPI';
import { useLogin } from '../../hooks/useLogin';
import LoginBar from '../../components/LoginBar/LoginBar';
import styles from './login.module.css';

export default function LoginPage() {
  const {
    setIsLoggedIn,
    setUser,
    accessToken,
    setAccessToken,
    expiresAt,
    setExpiresAt,
    applicationKey,
    setApplicationKey,
    isLoggedIn,
  } = React.useContext(UserContext) as UserContextType;
  
  const { login } = useLogin();
  const navigate = useNavigate();
  
  const [needsApplicationKey, setNeedsApplicationKey] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/authenticated');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (accessToken !== '' && expiresAt) {
      const appKey = applicationKey || undefined;
      login(accessToken, appKey).catch((err) => {
        console.error('Auto-login failed:', err);
      });
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
  }, [accessToken, expiresAt, applicationKey, login, setAccessToken, setUser, setIsLoggedIn, setExpiresAt]);

  useEffect(() => {
    backendAPI.checkCredentials().then((response) => {
      setNeedsApplicationKey(!response.hasAppKey);
    });
  }, []);
    
  const handleAccessTokenChange = (e: React.FormEvent<HTMLInputElement>) =>
    setAccessToken(e.currentTarget.value);

  const handleApplicationKeyChange = (e: React.FormEvent<HTMLInputElement>) =>
    setApplicationKey(e.currentTarget.value);

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (accessToken === '') {
      console.log('error: Access token is required')
      return;
    }
    
    if (needsApplicationKey && !applicationKey) {
      console.log('error: Application key is required')
      return;
    }

    try {
      const appKey = applicationKey || undefined;
      await login(accessToken, appKey);
      navigate('/authenticated');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div id="login" className={styles.login} data-testid="login-page">
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