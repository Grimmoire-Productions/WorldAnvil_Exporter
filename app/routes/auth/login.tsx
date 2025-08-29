import React, { useEffect, useState } from 'react';
import { useNavigate, redirect } from 'react-router';
import { UserContext } from '~/context/UserContext';
import type { UserContextType } from '~/utils/types';
import backendAPI from '~/utils/backendAPI';
import { useLogin } from '~/hooks/useLogin';
import LoginBar from '~/components/LoginBar/LoginBar';
import LoadingAnimation from '~/components/LoadingAnimation/LoadingAnimation';
import styles from './login.module.css';
import {ROUTE_PATHS} from '~/routes'
export default function LoginPage() {
  const {
    user,
    accessToken,
    setAccessToken,
    applicationKey,
    setApplicationKey,
    isLoggedIn,
  } = React.useContext(UserContext) as UserContextType;
  
  const { login } = useLogin();
  const navigate = useNavigate();
  
  const [needsApplicationKey, setNeedsApplicationKey] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Redirect to worlds if already logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      navigate(ROUTE_PATHS.worlds);
    }
  }, [isLoggedIn, user, navigate]);

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
      setIsLoggingIn(true);
      const appKey = applicationKey || undefined;
      await login(accessToken, appKey);
      navigate(ROUTE_PATHS.worlds);
    } catch (err) {
      console.error('Login failed:', err);
      let errorMessage = 'Authorization failed. Please check your credentials and try again.';
      
      if (err instanceof Error) {
        if (err.message.includes('unauthorized') || err.message.includes('401')) {
          errorMessage = 'Unauthorized: Invalid API key or token. Please check your credentials.';
        } else if (err.message.includes('worlds') || err.message.includes('fetch')) {
          errorMessage = 'Could not fetch worlds. Please try again.';
        }
      }
      
      navigate('/auth/unauthorized', { state: { error: errorMessage } });
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoggingIn) {
    return (
      <div id="login" className={styles.login} data-testid="login-page">
        <main>
          <LoadingAnimation />
          <p>Logging you in...</p>
        </main>
      </div>
    );
  }

  return (
    <div id="login" className={styles.login} data-testid="login-page">
      <main>
        <LoginBar
          accessToken={accessToken}
          onLogin={handleLogin}
          onUpdateAccessToken={handleAccessTokenChange}
          needsApplicationKey={needsApplicationKey}
          applicationKey={applicationKey}
          onUpdateApplicationKey={handleApplicationKeyChange}
        />
        <p>If you do not have an API Token, contact the World owner to request one.</p>
      </main>
    </div>
  );
}