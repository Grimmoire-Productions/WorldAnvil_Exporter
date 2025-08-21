import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExportHeader from "../../app/containers/ExportToolContainer/ExportHeader/ExportHeader"
import { ArticleContext } from "../../app/context/ArticleContext";
import { UserContext } from "../../app/context/UserContext";
import { WorldContext } from "../../app/context/WorldContext";
import backendAPI from "../../app/utils/backendAPI";
import type { ArticleContextType, UserContextType, WorldContextType } from "../../app/utils/types";

// Mock the SearchDropdown component
jest.mock("../../app/components/SearchDropdown/SearchDropdown", () => {
  return function MockSearchDropdown({
    id,
    placeholder,
    items,
    handleChange,
    currentSelection,
    isMultiSelect,
  }: any) {
    return (
      <div data-testid={id}>
        <select
          data-testid={`${id}-select`}
          onChange={(e) => {
            const selectedItem = items.find(
              (item: any) => item.value === e.target.value,
            );
            if (selectedItem) {
              handleChange(isMultiSelect ? [selectedItem] : selectedItem);
            }
          }}
          value={currentSelection?.value || ""}
        >
          <option value="">{placeholder}</option>
          {items.map((item: any) => (
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

// Mock the backendAPI
jest.mock("../../app/utils/backendAPI", () => ({
  getCharacterSheets: jest.fn(),
}));

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
    setExpiresAt: jest.fn()
  } as UserContextType;

  const renderWithContexts = (
    articleContext = mockArticleContext,
    worldContext = mockWorldContext,
    userContext = mockUserContext,
  ) => {
    return render(
      <ArticleContext.Provider value={articleContext}>
        <WorldContext.Provider value={worldContext}>
          <UserContext.Provider value={userContext}>
            <ExportHeader />
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

  describe("World Selection", () => {
    it("shows loading state when world is loading", () => {
      const loadingWorldContext = {
        ...mockWorldContext,
        worldIsLoading: true,
      };

      renderWithContexts(mockArticleContext, loadingWorldContext);

      // Check that dropdowns are not shown when loading
      expect(screen.queryByTestId("select-run-tag")).not.toBeInTheDocument();
      expect(screen.queryByTestId("select-tags")).not.toBeInTheDocument();
      expect(screen.queryByTestId("select-article")).not.toBeInTheDocument();
    });

    it("shows run tags dropdown when world is selected and not loading", () => {
      const selectedWorldContext = {
        ...mockWorldContext,
        selectedWorld: mockUserContext.user.worlds[0],
      };

      renderWithContexts(mockArticleContext, selectedWorldContext);

      expect(screen.getByTestId("select-run-tag")).toBeInTheDocument();
      expect(screen.getByText("--Choose a run--")).toBeInTheDocument();
    });

    it("shows non-run tags dropdown when world is selected and not loading", () => {
      const selectedWorldContext = {
        ...mockWorldContext,
        selectedWorld: mockUserContext.user.worlds[0],
      };

      renderWithContexts(mockArticleContext, selectedWorldContext);

      expect(screen.getByTestId("select-tags")).toBeInTheDocument();
      expect(screen.getByText("--Choose tags--")).toBeInTheDocument();
    });

    it("shows articles dropdown when world is selected and not loading", () => {
      const selectedWorldContext = {
        ...mockWorldContext,
        selectedWorld: mockUserContext.user.worlds[0],
      };

      renderWithContexts(mockArticleContext, selectedWorldContext);

      expect(screen.getByTestId("select-article")).toBeInTheDocument();
      expect(screen.getByText("--Select a Character--")).toBeInTheDocument();
    });

    it("handles world selection with existing character sheets", async () => {
      const user = userEvent.setup();
      renderWithContexts();

      const worldSelect = screen.getByTestId("select-world-select");
      await user.selectOptions(worldSelect, "Test World 1");

      expect(mockWorldContext.setSelectedWorld).toHaveBeenCalledWith(
        mockUserContext.user.worlds[0],
      );
    });

    it("handles world selection without character sheets (API call)", async () => {
      const user = userEvent.setup();
      const mockCharacterSheets = [
        { articleId: "char3", title: "Character 3", tags: ["tag4"] },
      ];

      (backendAPI.getCharacterSheets as jest.Mock).mockResolvedValue(
        mockCharacterSheets,
      );

      renderWithContexts();

      const worldSelect = screen.getByTestId("select-world-select");
      await user.selectOptions(worldSelect, "Test World 2");

      expect(mockWorldContext.setWorldIsLoading).toHaveBeenCalledWith(true);
      expect(backendAPI.getCharacterSheets).toHaveBeenCalledWith("world2");

      await waitFor(() => {
        expect(mockWorldContext.setWorldIsLoading).toHaveBeenCalledWith(false);
        expect(mockWorldContext.setSelectedWorld).toHaveBeenCalled();
      });
    });

    it("does not change world when same world is selected", async () => {
      const user = userEvent.setup();
      const selectedWorldContext = {
        ...mockWorldContext,
        selectedWorld: mockUserContext.user.worlds[0],
      };

      renderWithContexts(mockArticleContext, selectedWorldContext);

      const worldSelect = screen.getByTestId("select-world-select");
      await user.selectOptions(worldSelect, "Test World 1");

      expect(mockWorldContext.setSelectedWorld).not.toHaveBeenCalled();
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

  describe("useEffect Hooks", () => {
    it("resets state when selectedWorld changes", () => {
      const { rerender } = renderWithContexts();

      // Change selectedWorld
      const newWorldContext = {
        ...mockWorldContext,
        selectedWorld: mockUserContext.user.worlds[0],
      };

      rerender(
        <ArticleContext.Provider value={mockArticleContext}>
          <WorldContext.Provider value={newWorldContext}>
            <UserContext.Provider value={mockUserContext}>
              <ExportHeader />
            </UserContext.Provider>
          </WorldContext.Provider>
        </ArticleContext.Provider>,
      );

      expect(mockArticleContext.setArticleId).toHaveBeenCalledWith("");
      expect(mockArticleContext.setActiveCharacter).toHaveBeenCalledWith("");
      expect(mockWorldContext.setSelectedTags).toHaveBeenCalledWith([]);
      expect(mockWorldContext.setSelectedRunTag).toHaveBeenCalledWith(null);
    });

    it("calls fetchAndProcessCharacter when articleId changes", () => {
      const articleContextWithId = {
        ...mockArticleContext,
        articleId: "char1",
      };

      const selectedWorldContext = {
        ...mockWorldContext,
        selectedWorld: mockUserContext.user.worlds[0],
      };

      renderWithContexts(articleContextWithId, selectedWorldContext);

      expect(mockArticleContext.fetchAndProcessCharacter).toHaveBeenCalledWith(
        "char1",
        "test-world-1",
      );
    });
  });

  describe("Helper Functions", () => {
    it("creates world dropdown options correctly", () => {
      renderWithContexts();

      // The world dropdown should contain the world titles
      expect(screen.getByText("Test World 1")).toBeInTheDocument();
      expect(screen.getByText("Test World 2")).toBeInTheDocument();
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
    it.skip("handles API errors gracefully", async () => {
      const user = userEvent.setup();
      (backendAPI.getCharacterSheets as jest.Mock).mockRejectedValue(
        new Error("API Error"),
      );

      renderWithContexts();

      const worldSelect = screen.getByTestId("select-world-select");
      await user.selectOptions(worldSelect, "Test World 2");

      expect(mockWorldContext.setWorldIsLoading).toHaveBeenCalledWith(true);
      // The component should handle the error gracefully
    });

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
