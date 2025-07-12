import type { Meta, StoryObj } from '@storybook/react';

import ExportHeader from './ExportHeader';
import { ArticleContext } from '../../../context/ArticleContext';
import { UserContext } from '../../../context/UserContext';
import { WorldContext } from '../../../context/WorldContext';
import { mockUser } from '../../../context/__mocks__/mockUserData';
import type { ArticleContextType, UserContextType, WorldContextType } from '../../../utils/types';

const mockArticleContext: ArticleContextType = {
  articleId: '',
  setArticleId: () => {},
  activeCharacter: '',
  setActiveCharacter: () => {},
  fetchAndProcessCharacter: () => {},
  errorMessage: null,
  setErrorMessage: () => {},
  isArticleLoading: false,
  setIsArticleLoading: () => {}
};

const mockUserContext: UserContextType = {
  accessToken: 'mock-token',
  setAccessToken: () => {},
  user: mockUser,
  setUser: () => {},
  isLoggedIn: true,
  setIsLoggedIn: () => {},
  expiresAt: null,
  setExpiresAt: () => {}
};

const mockWorldContext: WorldContextType = {
  worldIsLoading: false,
  setWorldIsLoading: () => {},
  selectedWorld: null,
  setSelectedWorld: () => {},
  selectedTags: null,
  setSelectedTags: () => {},
  selectedRunTag: null,
  setSelectedRunTag: () => {}
};

const mockWorldContextWithSelectedWorld: WorldContextType = {
  ...mockWorldContext,
  selectedWorld: {
    id: "world-1",
    title: "Test World",
    cssClassName: "test-world",
    characterSheets: [
      {
        articleId: "char-1",
        title: "Test Character Run 1 pc",
        tags: ["Run:1", "pc"],
      },
      {
        articleId: "char-2",
        title: "Test Character Run 1 npc",
        tags: ["Run:1", "npc"],
      },
      {
        articleId: "char-3",
        title: "Test Character Run 2 pc",
        tags: ["run_2", "pc"],
      },
      {
        articleId: "char-4",
        title: "Test Character Run 2 npc",
        tags: ["run_2", "npc"],
      },
    ],
    tags: ["Run:1", "run_2", "npc", "pc"],
  },
};

const mockWorldContextLoading: WorldContextType = {
  ...mockWorldContext,
  worldIsLoading: true,
  selectedWorld: {
    id: 'world-1',
    title: 'Test World',
    cssClassName: 'test-world',
    characterSheets: null,
    tags: null
  }
};

const ExportHeaderWithContext = ({ 
  articleContext = mockArticleContext,
  userContext = mockUserContext,
  worldContext = mockWorldContext
}) => (
  <ArticleContext.Provider value={articleContext}>
    <UserContext.Provider value={userContext}>
      <WorldContext.Provider value={worldContext}>
        <ExportHeader />
      </WorldContext.Provider>
    </UserContext.Provider>
  </ArticleContext.Provider>
);

const meta = {
  title: 'Containers/ExportHeader',
  component: ExportHeaderWithContext,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', minHeight: '200px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExportHeaderWithContext>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};

export const WithSelectedWorld: Story = {
  args: {
    worldContext: mockWorldContextWithSelectedWorld
  }
};

export const LoadingWorld: Story = {
  args: {
    worldContext: mockWorldContextLoading,
  },
};

export const WithRun1TagSelected: Story = {
  args: {
    worldContext: {
      ...mockWorldContextWithSelectedWorld,
      selectedRunTag: { id: "Run:1", value: "Run:1", label: "Run:1" },
    },
  },
};

export const WithNpcTagSelected: Story = {
  args: {
    worldContext: {
      ...mockWorldContextWithSelectedWorld,
      selectedTags: [{ id: "npc", value: "npc", label: "npc" }],
    },
  },
};

export const WithRun2AndPCTagsSelected: Story = {
  args: {
    worldContext: {
      ...mockWorldContextWithSelectedWorld,
      selectedTags: [{ id: "pc", value: "pc", label: "pc" }],
      selectedRunTag: { id: "run_2", value: "run_2", label: "run_2" },
    },
  },
};
