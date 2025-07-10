import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginContainer from '../../src/containers/LoginContainer/LoginContainer';
import UserProvider from '../../src/context/UserContext';
import worldAnvilAPI from '../../src/utils/worldAnvilAPI';
import '@testing-library/jest-dom';
/* eslint-disable no-empty-function, @typescript-eslint/no-empty-function */

describe('LoginContainer', () => {

  const userInit = {
    isLoggedIn: false,
    user: null,
    accessToken: '',
    expiresAt: null,
  };

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