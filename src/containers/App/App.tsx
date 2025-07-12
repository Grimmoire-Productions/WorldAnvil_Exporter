import React from 'react';
import UserProvider from '../../context/UserContext';
import { getUserToken } from '../../utils/userToken';
import type { UserInitialValues } from '../../utils/types';
import MainContainer from '../MainContainer/MainContainer';
import './App.css'

function App() {
  const initUserToken = getUserToken();

  const userInitialValues: UserInitialValues = {
    isLoggedIn: false,
    user: null,
    expiresAt: initUserToken?.expiry || null,
    accessToken: initUserToken?.value || '',
    applicationKey: null,
  };

  return (
    <div>
      <UserProvider initialValues={userInitialValues}>
        <MainContainer/>
      </UserProvider>
    </div>
  );
}

export default App;