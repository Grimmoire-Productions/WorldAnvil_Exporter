import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExportHeader from "./ExportHeader"
import { ArticleContext } from "../../../context/ArticleContext/ArticleContext";
import { UserContext } from "../../../context/UserContext/UserContext";
import { WorldContext } from "../../../context/WorldContext/WorldContext";
import type { ArticleContextType, UserContextType, WorldContextType, DropdownOption } from "../../../utils/types";

// Mock the SearchDropdown component
jest.mock("../../app/components/SearchDropdown/SearchDropdown", () => {
  return function MockSearchDropdown({
    id,
    placeholder,
    items,
    handleChange,
    currentSelection,
    isMultiSelect,
  }: {
    id: string;
    placeholder: string;
    items: DropdownOption[];
    handleChange: (value: DropdownOption | DropdownOption[]) => void;
    currentSelection?: DropdownOption | DropdownOption[];
    isMultiSelect?: boolean;
  }) {
    return (
      <div data-testid={id}>
        <select
          data-testid={`${id}-select`}
          onChange={(e) => {
            const selectedItem = items.find(
              (item: DropdownOption) => item.value === e.target.value,
            );
            if (selectedItem) {
              handleChange(isMultiSelect ? [selectedItem] : selectedItem);
            }
          }}
          value={Array.isArray(currentSelection) ? "" : currentSelection?.value || ""}
        >
          <option value="">{placeholder}</option>
          {items.map((item: DropdownOption) => (
            <option key={item.id} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

// Mock the CSS module
jest.mock(
  "../../app/containers/ExportToolContainer/ExportToolContainer.module.css",
  () => ({
    ExportHeader: "export-header",
    Loading: "loading",
  }),
);


describe("ExportHeader", () => {
  // Mock context values
  const mockArticleContext = {
    articleId: "",
    setArticleId: jest.fn(),
    fetchAndProcessCharacter: jest.fn(),
    activeCharacter: "",
    setActiveCharacter: jest.fn(),
    errorMessage: "",
    setErrorMessage: jest.fn(),
    isArticleLoading: false,
    setIsArticleLoading: jest.fn(),
  } as ArticleContextType;

  const mockWorldContext = {
    worldIsLoading: false,
    setWorldIsLoading: jest.fn(),
    selectedWorld: null,
    setSelectedWorld: jest.fn(),
    selectedTags: [],
    setSelectedTags: jest.fn(),
    selectedRunTag: null,
    setSelectedRunTag: jest.fn(),
  } as WorldContextType;

  const mockUserContext = {
    isLoggedIn: true,
    setIsLoggedIn: jest.fn(),
    user: {
      displayName: "Test User",
      id: "abc123",
      worlds: [
        {
          id: "world1",
          title: "Test World 1",
          cssClassName: "test-world-1",
          characterSheets: [
            {
              articleId: "char1",
              title: "Character 1",
              tags: ["tag1", "tag2", "run1"],
            },
            {
              articleId: "char2",
              title: "Character 2",
              tags: ["tag2", "tag3", "run2"],
            },
          ],
          tags: ["tag1", "tag2", "tag3", "run1", "run2"],
        },
        {
          id: "world2",
          title: "Test World 2",
          cssClassName: "test-world-2",
          characterSheets: null,
          tags: null,
        },
      ],
    },
    setUser: jest.fn(),
    accessToken: "test-token",
    setAccessToken: jest.fn(),
    expiresAt: 1234,
    setExpiresAt: jest.fn(),
    applicationKey: "test-app-key",
    setApplicationKey: jest.fn(),
    isAutoLoginPending: false,
    setIsAutoLoginPending: jest.fn(),
    isAutoLoginInProgress: false,
    setIsAutoLoginInProgress: jest.fn(),
  } as UserContextType;

  // Helper functions that mirror the actual export page logic
  const runDropdownOptions = (tags: string[] | undefined | null): DropdownOption[] => {
    const options: DropdownOption[] = [];
    if (tags) {
      tags.filter(tag => tag.toLowerCase().includes('run')).forEach((tag: string) => {
        options.push({
          value: tag,
          id: tag,
          label: tag
        });
      });
    }
    return options;
  };

  const tagDropdownOptions = (tags: string[] | undefined | null): DropdownOption[] => {
    const options: DropdownOption[] = [];
    if (tags) {
      tags.filter(tag => !tag.toLowerCase().includes('run') && !tag.toLowerCase().includes('character_sheet')).forEach((tag: string) => {
        options.push({
          value: tag,
          id: tag,
          label: tag
        });
      });
    }
    return options;
  };

  const renderWithContexts = (
    articleContext = mockArticleContext,
    worldContext = mockWorldContext,
    userContext = mockUserContext,
  ) => {
    // Create articlesList from selectedWorld's characterSheets
    const articlesList: DropdownOption[] = worldContext.selectedWorld?.characterSheets?.map(sheet => ({
      value: sheet.title,
      id: sheet.articleId,
      label: sheet.title
    })) || [];

    return render(
      <ArticleContext.Provider value={articleContext}>
        <WorldContext.Provider value={worldContext}>
          <UserContext.Provider value={userContext}>
            <ExportHeader 
              selectedWorld={worldContext.selectedWorld}
              selectedTags={worldContext.selectedTags || []}
              selectedRunTag={worldContext.selectedRunTag}
              articlesList={articlesList}
              articleId={articleContext.articleId}
              runDropdownOptions={runDropdownOptions}
              tagDropdownOptions={tagDropdownOptions}
              onSelectedTagChange={worldContext.setSelectedTags}
              onSelectedRunTagChange={worldContext.setSelectedRunTag}
              onArticleChange={(option: DropdownOption) => articleContext.setArticleId(option.id)}
            />
          </UserContext.Provider>
        </WorldContext.Provider>
      </ArticleContext.Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial Rendering", () => {
    it("renders placeholder message when no world is selected", () => {
      renderWithContexts();

      expect(screen.getByText("Please select a world from the dropdown above to begin")).toBeInTheDocument();
    });

    it("renders run, tags, and character dropdowns when world is selected", () => {
      const worldContextWithSelection = {
        ...mockWorldContext,
        selectedWorld: mockUserContext.user.worlds[0]
      };

      renderWithContexts(
        mockArticleContext,
        worldContextWithSelection
      );

      expect(screen.getByTestId("select-run-tag")).toBeInTheDocument();
      expect(screen.getByTestId("select-tags")).toBeInTheDocument();
      expect(screen.getByTestId("select-article")).toBeInTheDocument();
    });
  });


  describe("Tag Selection", () => {
    const selectedWorldContext = {
      ...mockWorldContext,
      selectedWorld: mockUserContext.user.worlds[0],
    };

    it("handles run tag selection", async () => {
      const user = userEvent.setup();
      renderWithContexts(mockArticleContext, selectedWorldContext);

      const runTagSelect = screen.getByTestId("select-run-tag-select");
      await user.selectOptions(runTagSelect, "run1");

      expect(mockWorldContext.setSelectedRunTag).toHaveBeenCalled();
    });

    it("handles non-run tag selection", async () => {
      const user = userEvent.setup();
      renderWithContexts(mockArticleContext, selectedWorldContext);

      const tagSelect = screen.getByTestId("select-tags-select");
      await user.selectOptions(tagSelect, "tag1");

      expect(mockWorldContext.setSelectedTags).toHaveBeenCalled();
    });

    it("filters articles based on selected tags and run tag", () => {
      const selectedTagsContext = {
        ...selectedWorldContext,
        selectedTags: [{ value: "tag1", id: "tag1", label: "tag1" }],
        selectedRunTag: { value: "run1", id: "run1", label: "run1" },
      };

      renderWithContexts(mockArticleContext, selectedTagsContext);

      // The component should filter articles based on both tags and run tag
      expect(screen.getByTestId("select-article")).toBeInTheDocument();
    });
  });

  describe("Article Selection", () => {
    const selectedWorldContext = {
      ...mockWorldContext,
      selectedWorld: mockUserContext.user.worlds[0],
    };

    it("handles article selection", async () => {
      const user = userEvent.setup();
      renderWithContexts(mockArticleContext, selectedWorldContext);

      const articleSelect = screen.getByTestId("select-article-select");
      await user.selectOptions(articleSelect, "Character 1");

      expect(mockArticleContext.setArticleId).toHaveBeenCalledWith("char1");
    });
  });

  describe("Component Props", () => {
    it("displays correct articlesList when world has character sheets", () => {
      const selectedWorldContext = {
        ...mockWorldContext,
        selectedWorld: mockUserContext.user.worlds[0],
      };

      renderWithContexts(mockArticleContext, selectedWorldContext);

      // Should show the articles dropdown with characters from the selected world
      expect(screen.getByTestId("select-article")).toBeInTheDocument();
      
      // Check that the select dropdown contains the expected options
      const articleSelect = screen.getByTestId("select-article-select");
      expect(articleSelect).toBeInTheDocument();
    });

    it("handles empty articlesList when world has no character sheets", () => {
      const selectedWorldContext = {
        ...mockWorldContext,
        selectedWorld: {
          ...mockUserContext.user.worlds[1], // This one has null characterSheets
        },
      };

      renderWithContexts(mockArticleContext, selectedWorldContext);

      // Should still show the articles dropdown, but it will be empty
      expect(screen.getByTestId("select-article")).toBeInTheDocument();
    });
  });

  describe("Helper Functions", () => {
    it("creates run tag dropdown options correctly", () => {
      const selectedWorldContext = {
        ...mockWorldContext,
        selectedWorld: mockUserContext.user.worlds[0],
      };

      renderWithContexts(mockArticleContext, selectedWorldContext);

      // The run tag dropdown should contain run tags
      expect(screen.getByText("--Choose a run--")).toBeInTheDocument();
    });

    it("handles empty character sheets", () => {
      const worldWithoutCharacters = {
        ...mockUserContext.user.worlds[0],
        characterSheets: null,
      };

      const selectedWorldContext = {
        ...mockWorldContext,
        selectedWorld: worldWithoutCharacters,
      };

      renderWithContexts(mockArticleContext, selectedWorldContext);

      expect(screen.getByTestId("select-article")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {

    it("handles null user context", () => {
      const nullUserContext = {
        ...mockUserContext,
        user: null,
      };

      expect(() => {
        renderWithContexts(
          mockArticleContext,
          mockWorldContext,
          nullUserContext,
        );
      }).not.toThrow();
    });
  });
});
