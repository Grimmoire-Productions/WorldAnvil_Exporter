import type { User } from "../../utils/types";

/**
 * Mock user data for Storybook and testing
 */
export const mockUser: User = {
  displayName: "Storybook User",
  id: "storybook-user-id",
  worlds: [
    {
      id: "hawkins-world-id",
      title: "Hawkins",
      cssClassName: "hawkins",
      characterSheets: null,
      tags: null,
    },
    {
      id: "lies-world-id",
      title: "Lies and Liability",
      cssClassName: "liesAndLiability",
      characterSheets: null,
      tags: null,
    },
    {
      id: "test-world-id",
      title: "Test World",
      cssClassName: "default",
      characterSheets: null,
      tags: null,
    },
  ],
};
