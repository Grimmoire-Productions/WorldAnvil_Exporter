import type { Meta, StoryObj } from '@storybook/react-vite';

import LoginContainer from './LoginContainer';
import { UserContext } from "../../context/UserContext";
import type { UserContextType } from '../../utils/types';
import { setApplicationKeyMock } from '#consts';

const mockUserContext: UserContextType = {
  accessToken: '',
  setAccessToken: () => {},
  user: null,
  setUser: () => {},
  isLoggedIn: true,
  setIsLoggedIn: () => {},
  expiresAt: null,
  setExpiresAt: () => {},
  applicationKey: null,
  setApplicationKey: () => {}
};

const mockUserContextWithoutAppKey: UserContextType = {
  ...mockUserContext,
  applicationKey: ''
};

const LoginContainerWithContext = ({ userContext = mockUserContext }) => (
  <UserContext.Provider value={userContext}>
    <LoginContainer />
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
      <div style={{ width: "100%", minHeight: "200px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoginContainer>;

export default meta;

type Story = StoryObj<typeof meta>;


export const WithApplicationKeyInEnv: Story = {
  beforeEach: () => {
    setApplicationKeyMock("testKey");
  },
  name: "With Application Key in Environment",
  parameters: {
    docs: {
      description: {
        story:
          "Simulates when an application key is provided by the environment. Only the access token input field is displayed.",
      },
    },
  },
};

export const WithoutApplicationKeyInEnv: Story = {
  beforeEach: () => {
    setApplicationKeyMock(undefined)
  },
  name: "Without Application Key in Environment",
  render: () => <LoginContainerWithContext userContext={mockUserContextWithoutAppKey} />,
  parameters: {
    docs: {
      description: {
        story:
          "Simulates when no application key is provided. Both application key and access token input fields are displayed.",
      },
    },
  },
};