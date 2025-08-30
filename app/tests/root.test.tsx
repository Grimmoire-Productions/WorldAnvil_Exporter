import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import Root from "../root";
import LoginPage from "../routes/auth/login";
import UserProvider from "../context/UserContext";
import type { UserInitialValues } from "../utils/types";
import React from "react";

describe("Root Layout", () => {
  it("renders root layout", () => {
    render(
      <MemoryRouter>
        <Root />
      </MemoryRouter>
    );
    // Test that the root layout renders without crashing
    expect(document.querySelector('.App')).toBeInTheDocument();
  });
});

describe("Login Page", () => {
  const userInit = {
    isLoggedIn: false,
    user: null,
    accessToken: '',
    expiresAt: null,
    applicationKey: null,
    isAutoLoginPending: false,
    isAutoLoginInProgress: false,
  } as UserInitialValues;

  it("renders login page content", () => {
    render(
      <MemoryRouter>
        <UserProvider initialValues={userInit}>
          <LoginPage />
        </UserProvider>
      </MemoryRouter>
    );
    const loginHelperText = screen.getByText(/If you do not have an API Token, contact the World owner to request one/i);
    expect(loginHelperText).toBeInTheDocument();
  });

  it('renders the login page', () => {
    render(
      <MemoryRouter>
        <UserProvider initialValues={userInit}>
          <LoginPage />
        </UserProvider>
      </MemoryRouter>
    );
    const loginPage = screen.queryByTestId("login-page");
    expect(loginPage).toBeInTheDocument();
   })
});
