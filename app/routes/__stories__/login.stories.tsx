import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useEffect } from 'react';
import { MemoryRouter } from 'react-router';

import LoginPage from "../auth/login";
import { UserContext } from "../../context/UserContext";
import type { UserContextType } from '../../utils/types';
import backendAPI from '../../utils/backendAPI';

const mockUserContext: UserContextType = {
  accessToken: '',
  setAccessToken: () => {},
  user: null,
  setUser: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  expiresAt: null,
  setExpiresAt: () => {},
  applicationKey: '',
  setApplicationKey: () => {}
};

const LoginContainerWithContext = ({ userContext = mockUserContext }) => (
  <UserContext.Provider value={userContext}>
    <LoginPage />
  </UserContext.Provider>
);


const meta = {
  title: "Containers/LoginContainer",
  component: LoginContainerWithContext,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ width: "100%", minHeight: "200px" }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof LoginContainerWithContext>;

export default meta;

type Story = StoryObj<typeof meta>;


export const WithBackendApplicationKey: Story = {
  decorators: [
    (Story) => {
      // Override the checkCredentials method before component renders
      const _originalCheckCredentials = backendAPI.checkCredentials;
      backendAPI.checkCredentials = () => Promise.resolve({ hasAppKey: true });
      
      return (
        <div style={{ width: "100%", minHeight: "200px" }}>
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    docs: {
      description: {
        story:
          "Simulates when the backend server has an application key configured. Only the access token input field is displayed.",
      },
    },
  },
};

export const WithoutBackendApplicationKey: Story = {
  decorators: [
    (Story) => {
      // Override the checkCredentials method before component renders
      const originalCheckCredentials = backendAPI.checkCredentials;
      backendAPI.checkCredentials = () => Promise.resolve({ hasAppKey: false });
      
      // Restore original method on cleanup
      useEffect(() => {
        return () => {
          backendAPI.checkCredentials = originalCheckCredentials;
        };
      }, [originalCheckCredentials]);
      
      return (
        <div style={{ width: "100%", minHeight: "200px" }}>
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    docs: {
      description: {
        story:
          "Simulates when the backend server doesn't have an application key. Both application key and access token input fields are displayed.",
      },
    },
  },
};