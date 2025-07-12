import type { User } from '../../utils/types';

/**
 * Mock user data for development mode.
 * 
 * Configuration is read from environment variables in .env file.
 * 
 * To enable dev mode (bypass login):
 * - Run: make start-dev-mode
 * 
 * To use normal login:
 * - Run: make start
 */
export const mockDevUser: User = {
  displayName: import.meta.env.VITE_DEV_USER_DISPLAY_NAME || 'dev-user',
  id: import.meta.env.VITE_DEV_USER_ID || 'dev-user-id',
  worlds: [
    {
      id: import.meta.env.VITE_DEV_WORLD_1_ID || 'world-1-id',
      title: import.meta.env.VITE_DEV_WORLD_1_TITLE || 'World 1',
      cssClassName: import.meta.env.VITE_DEV_WORLD_1_CSS || 'default',
      characterSheets: null,
      tags: null
    },
    {
      id: import.meta.env.VITE_DEV_WORLD_2_ID || 'world-2-id',
      title: import.meta.env.VITE_DEV_WORLD_2_TITLE || 'World 2',
      cssClassName: import.meta.env.VITE_DEV_WORLD_2_CSS || 'default',
      characterSheets: null,
      tags: null
    }
  ]
};

/**
 * Mock user data for Storybook - no environment variable dependencies
 */
export const mockUser: User = {
  displayName: 'Storybook User',
  id: 'storybook-user-id',
  worlds: [
    {
      id: 'hawkins-world-id',
      title: 'Hawkins',
      cssClassName: 'hawkins',
      characterSheets: null,
      tags: null
    },
    {
      id: 'lies-world-id', 
      title: 'Lies and Liability',
      cssClassName: 'liesAndLiability',
      characterSheets: null,
      tags: null
    },
    {
      id: 'test-world-id',
      title: 'Test World',
      cssClassName: 'default',
      characterSheets: null,
      tags: null
    }
  ]
};