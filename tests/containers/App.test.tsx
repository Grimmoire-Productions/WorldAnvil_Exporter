import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import Root from "../../app/root";
import LoginPage from "../../app/routes/auth/login";
import UserProvider from "../../app/context/UserContext";
import type { UserInitialValues } from "../../app/utils/types";
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
  } as UserInitialValues;

  it("renders header", () => {
    render(
      <MemoryRouter>
        <UserProvider initialValues={userInit}>
          <LoginPage />
        </UserProvider>
      </MemoryRouter>
    );
    const header = screen.getByText(/World Anvil Character Sheet Export Tool/i);
    expect(header).toBeInTheDocument();
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
