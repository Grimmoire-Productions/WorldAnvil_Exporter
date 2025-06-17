import React from 'react';
import UserProvider from '../../context/UserContext';
import { getUserToken } from '../../utils/userToken';
import type { UserInitialValues } from '../../utils/types';
import MainContainer from '../MainContainer/MainContainer';

function App() {

  const initUserToken = getUserToken();

  const userInitialValues: UserInitialValues = {
    isLoggedIn: false,
    user: null,
    expiresAt: initUserToken?.expiry || null,
    accessToken: initUserToken?.value || '',
  };

  return (
    <div>
      <UserProvider initialValues={userInitialValues}>
        <header>
          <h1>World Anvil Character Sheet Export Tool</h1>
        </header>
        <MainContainer/>
      </UserProvider>
      <footer>
        <p>Kelsey Morse-Brown 2024</p>
      </footer>
    </div>
  );
}

export default App;