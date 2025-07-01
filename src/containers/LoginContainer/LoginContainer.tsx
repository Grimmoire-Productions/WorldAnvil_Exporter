import React, { useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import type { UserContextType } from '../../utils/types.ts';
import worldAnvilAPI from '../../utils/worldAnvilAPI.ts';
import LoginBar from '../../components/LoginBar/LoginBar.tsx';

function LoginContainer() {
  const {
    setIsLoggedIn,
    setUser,
    accessToken,
    setAccessToken,
    expiresAt,
    setExpiresAt,
  } = React.useContext(UserContext) as UserContextType;

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

  const login = async (accessToken: string) => {
    try {
      const userResponse = await worldAnvilAPI.logIn(accessToken);
      if (userResponse.displayName) {
        const worlds = await worldAnvilAPI.getWorlds(accessToken, userResponse.id)
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
      console.log('error')
      return;
    }

    login(accessToken)
    
    return;
  };

  return (
    <div id="login" className={'login'}>
      <header>
        <h1>World Anvil Character Sheet Export Tool</h1>
      </header>
      <main>
        <LoginBar
          accessToken={accessToken}
          onLogin={handleLogin}
          onUpdateAccessToken={handleAccessTokenChange}
        />
      </main>
      <footer>
        <p>Kelsey Morse-Brown 2024</p>
      </footer>
    </div>
  );
}

export default LoginContainer;