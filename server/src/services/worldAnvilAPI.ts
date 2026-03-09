import { WorldAnvilBaseService } from "../../../shared/services/worldAnvilBaseService.js";
import type {
  User,
  World,
  Article,
  ArticleResponse,
  CharacterSheet,
} from "../../../shared/types/worldAnvilTypes.js";
// import { mockUser } from '../../__mocks__/mockUserData'
import { mockCharacterSheet } from "../../__mocks__/mockArticleData";

const APPLICATION_KEY = process.env.WA_API_KEY || "";

class WorldAnvilAPIService extends WorldAnvilBaseService {
  private appKey: string;

  constructor(appKey?: string) {
    super();
    this.appKey = appKey || APPLICATION_KEY;
  }

  setCredentials(userToken: string, appKey?: string) {
    super.setCredentials(userToken, appKey || this.appKey);
    if (appKey) {
      this.appKey = appKey;
    }
  }

  protected logError(message: string, ...args: unknown[]): void {
    console.error(message, ...args);
  }

  protected onTokenRefresh(): void {
    // Backend doesn't need to handle token refresh for localStorage
    // Session management is handled by express-session
  }

  async logIn(userToken: string, appKey?: string): Promise<User> {
    this.setCredentials(userToken, appKey);

    // if (process.env.MOCK_API === "true") {
    //   return mockUser;
    // }

    try {
      const jsonResponse = await this.fetchUserIdentity();

      return {
        displayName: jsonResponse.username,
        id: jsonResponse.id,
        worlds: null,
      };
    } catch (error) {
      const errorText =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Login API error:", {
        error: errorText,
        userToken: this.userToken?.substring(0, 10) + "...",
        appKey: this.appKey?.substring(0, 10) + "...",
      });
      throw new Error(`Authentication failed: ${errorText}`);
    }
  }

  async getWorlds(userId: string): Promise<World[]> {
    console.log("Fetching worlds from World Anvil for user:", userId);

    // console.log("MOCK_API ", process.env.MOCK_API);
    // if (process.env.MOCK_API === "true") {
    //   return mockUser.worlds;
    // }

    try {
      const jsonResponse = await this.fetchUserWorlds(userId);

      return jsonResponse.entities.map((world) => ({
        id: world.id,
        title: world.title,
        cssClassName: world.title.replaceAll(/\s/g, "").replace("&", "And"),
      }));
    } catch (error) {
      console.error("Failed to fetch worlds:", error);
      throw error;
    }
  }

  async getArticles(worldId: string): Promise<Article[]> {
    const allArticles: Article[] = [];
    const limit = 50;
    let offset = 0;
    let hasMore = true;

    const fetchPage = async (): Promise<Article[]> => {
      const jsonResponse = await this.fetchWorldArticles(worldId, offset);
      const numArticlesInResponse = jsonResponse.entities.length;

      const currentArticles: Article[] = jsonResponse.entities.map(
        (article) => ({
          articleId: article.id,
          title: article.title,
          tags: article.tags?.split(",") || [],
        }),
      );

      if (currentArticles && currentArticles.length > 0) {
        allArticles.push(...currentArticles);
      }

      // Determine if there are more articles to fetch
      if (numArticlesInResponse < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }

      // If there are more pages, recursively call fetchPage
      if (hasMore) {
        return fetchPage();
      } else {
        return allArticles;
      }
    };

    return fetchPage();
  }

  async getCharacterSheets(worldId: string): Promise<CharacterSheet[]> {
    const allCharacterSheets: CharacterSheet[] = [];
    const limit = 50;
    let offset = 0;
    let hasMore = true;

    if (process.env.MOCK_API) {
      console.log("MOCK_API ", process.env.MOCK_API);
    }
    if (process.env.MOCK_API === "true") {
      return [mockCharacterSheet];
    }

    const fetchPage = async (): Promise<CharacterSheet[]> => {
      const jsonResponse = await this.fetchWorldArticles(worldId, offset);
      const numArticlesInResponse = jsonResponse.entities.length;

      const currentArticles: CharacterSheet[] = jsonResponse.entities
        .filter(
          (article) =>
            article.tags?.includes("character_sheet") ||
            article.tags?.includes("blue_sheet") ||
            article.customArticleTemplate
              ?.toLowerCase()
              .includes("character sheet"),
        )
        .map((article) => ({
          articleId: article.id,
          title: article.title,
          tags: article.tags?.split(",") || [],
        }));

      if (currentArticles && currentArticles.length > 0) {
        allCharacterSheets.push(...currentArticles);
      }

      // Determine if there are more articles to fetch
      if (numArticlesInResponse < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }

      // If there are more pages, recursively call fetchPage
      if (hasMore) {
        return fetchPage();
      } else {
        return allCharacterSheets;
      }
    };

    return fetchPage();
  }

  async fetchCharacter(charId: string): Promise<ArticleResponse> {
    return this.fetchArticle(charId);
  }

  async fetchSecrets(secretId: string): Promise<string> {
    const response = await this.fetchSecret(secretId);
    return response.content;
  }
}

// Create and export a singleton instance
const worldAnvilAPI = new WorldAnvilAPIService();
export default worldAnvilAPI;
