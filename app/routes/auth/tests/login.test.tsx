import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import LoginPage from '../login';
import UserProvider from '../../../context/UserContext/UserProvider';
import '@testing-library/jest-dom';
import type { UserInitialValues } from '../../../utils/types';


describe('LoginPage', () => {

  const userInit = {
    isLoggedIn: false,
    user: null,
    accessToken: '',
    expiresAt: null,
    applicationKey: null,
  } as UserInitialValues;

  it('Displays the login button', async () => {
    render(
      <MemoryRouter>
        <UserProvider initialValues={userInit}>
          <LoginPage />
        </UserProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('Displays the search placeholder text', async () => {
    render(
      <MemoryRouter>
        <UserProvider initialValues={userInit}>
          <LoginPage />
        </UserProvider>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Enter Your User API Token/i)).toBeInTheDocument();
  });
});
 