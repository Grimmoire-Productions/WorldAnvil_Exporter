import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MemoryRouter } from "react-router";
import ExportHeader from "./ExportHeader";
import type { DropdownOption, World } from "../../../utils/types";

const mockWorld: World = {
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
};

const runDropdownOptions = (
  tags: string[] | undefined | null,
): DropdownOption[] => {
  const options: DropdownOption[] = [];
  if (tags) {
    tags
      .filter((tag) => tag.toLowerCase().includes("run"))
      .forEach((tag: string) => {
        options.push({
          value: tag,
          id: tag,
          label: tag,
        });
      });
  }
  return options;
};

const tagDropdownOptions = (
  tags: string[] | undefined | null,
): DropdownOption[] => {
  const options: DropdownOption[] = [];
  if (tags) {
    tags
      .filter(
        (tag) =>
          !tag.toLowerCase().includes("run") &&
          !tag.toLowerCase().includes("character_sheet"),
      )
      .forEach((tag: string) => {
        options.push({
          value: tag,
          id: tag,
          label: tag,
        });
      });
  }
  return options;
};

const articlesList: DropdownOption[] = [
  {
    id: "char-1",
    value: "Test Character Run 1 pc",
    label: "Test Character Run 1 pc",
  },
  {
    id: "char-2",
    value: "Test Character Run 1 npc",
    label: "Test Character Run 1 npc",
  },
  {
    id: "char-3",
    value: "Test Character Run 2 pc",
    label: "Test Character Run 2 pc",
  },
  {
    id: "char-4",
    value: "Test Character Run 2 npc",
    label: "Test Character Run 2 npc",
  },
];

const meta = {
  title: "Features/ArticleExport/ExportHeader",
  component: ExportHeader,
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
  argTypes: {
    onSelectedTagChange: { action: "tag selected" },
    onSelectedRunTagChange: { action: "run tag selected" },
    onArticleChange: { action: "article selected" },
  },
} satisfies Meta<typeof ExportHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoWorldSelected: Story = {
  args: {
    selectedWorld: null,
    selectedTags: [],
    selectedRunTag: null,
    articlesList: [],
    runDropdownOptions,
    tagDropdownOptions,
    onSelectedTagChange: () => {},
    onSelectedRunTagChange: () => {},
    onArticleChange: () => {},
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Displays a message when no world has been selected yet.",
      },
    },
  },
};

export const Default: Story = {
  args: {
    selectedWorld: mockWorld,
    selectedTags: [],
    selectedRunTag: null,
    articlesList,
    runDropdownOptions,
    tagDropdownOptions,
    onSelectedTagChange: () => {},
    onSelectedRunTagChange: () => {},
    onArticleChange: () => {},
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default state with a selected world and all character sheets available.",
      },
    },
  },
};

export const WithWorldId: Story = {
  args: {
    selectedWorld: mockWorld,
    selectedTags: [],
    selectedRunTag: null,
    articlesList,
    worldId: "world-1",
    runDropdownOptions,
    tagDropdownOptions,
    onSelectedTagChange: () => {},
    onSelectedRunTagChange: () => {},
    onArticleChange: () => {},
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the back button when worldId is provided.",
      },
    },
  },
};

export const WithArticleSelected: Story = {
  args: {
    selectedWorld: mockWorld,
    selectedTags: [],
    selectedRunTag: null,
    articlesList,
    articleId: "char-1",
    worldId: "world-1",
    runDropdownOptions,
    tagDropdownOptions,
    onSelectedTagChange: () => {},
    onSelectedRunTagChange: () => {},
    onArticleChange: () => {},
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows a selected character with back button to export page.",
      },
    },
  },
};

export const WithRun1TagSelected: Story = {
  args: {
    selectedWorld: mockWorld,
    selectedTags: [],
    selectedRunTag: { id: "Run:1", value: "Run:1", label: "Run:1" },
    articlesList: [
      {
        id: "char-1",
        value: "Test Character Run 1 pc",
        label: "Test Character Run 1 pc",
      },
      {
        id: "char-2",
        value: "Test Character Run 1 npc",
        label: "Test Character Run 1 npc",
      },
    ],
    runDropdownOptions,
    tagDropdownOptions,
    onSelectedTagChange: () => {},
    onSelectedRunTagChange: () => {},
    onArticleChange: () => {},
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Filters character list by Run:1 tag.",
      },
    },
  },
};

export const WithNpcTagSelected: Story = {
  args: {
    selectedWorld: mockWorld,
    selectedTags: [{ id: "npc", value: "npc", label: "npc" }],
    selectedRunTag: null,
    articlesList: [
      {
        id: "char-2",
        value: "Test Character Run 1 npc",
        label: "Test Character Run 1 npc",
      },
      {
        id: "char-4",
        value: "Test Character Run 2 npc",
        label: "Test Character Run 2 npc",
      },
    ],
    runDropdownOptions,
    tagDropdownOptions,
    onSelectedTagChange: () => {},
    onSelectedRunTagChange: () => {},
    onArticleChange: () => {},
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Filters character list by npc tag.",
      },
    },
  },
};

export const WithRun2AndPCTagsSelected: Story = {
  args: {
    selectedWorld: mockWorld,
    selectedTags: [{ id: "pc", value: "pc", label: "pc" }],
    selectedRunTag: { id: "run_2", value: "run_2", label: "run_2" },
    articlesList: [
      {
        id: "char-3",
        value: "Test Character Run 2 pc",
        label: "Test Character Run 2 pc",
      },
    ],
    runDropdownOptions,
    tagDropdownOptions,
    onSelectedTagChange: () => {},
    onSelectedRunTagChange: () => {},
    onArticleChange: () => {},
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Filters character list by both run_2 and pc tags.",
      },
    },
  },
};

export const Loading: Story = {
  args: {
    selectedWorld: mockWorld,
    selectedTags: [],
    selectedRunTag: null,
    articlesList,
    runDropdownOptions,
    tagDropdownOptions,
    onSelectedTagChange: () => {},
    onSelectedRunTagChange: () => {},
    onArticleChange: () => {},
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: "All dropdowns are disabled while loading.",
      },
    },
  },
};
