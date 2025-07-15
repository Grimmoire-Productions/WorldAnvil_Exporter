import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginContainer from '../../src/containers/LoginContainer/LoginContainer';
import UserProvider from '../../src/context/UserContext';
import '@testing-library/jest-dom';
import type { UserInitialValues } from '../../src/utils/types';
/* eslint-disable no-empty-function, @typescript-eslint/no-empty-function */

describe('LoginContainer', () => {

  const userInit = {
    isLoggedIn: false,
    user: null,
    accessToken: '',
    expiresAt: null,
    applicationKey: null,
  } as UserInitialValues;

  it('Displays the login button', async () => {
    render(
      <UserProvider initialValues={userInit}>
        <LoginContainer />
      </UserProvider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('Displays the search placeholder text', async () => {
    render(
      <UserProvider initialValues={userInit}>
        <LoginContainer />
      </UserProvider>
    );

    expect(screen.getByPlaceholderText(/Enter Your User API Token/i)).toBeInTheDocument();
  });
});
/* eslint-enable no-empty-function, @typescript-eslint/no-empty-function */