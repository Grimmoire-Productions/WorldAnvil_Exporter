import { WorldAnvilBaseService } from 'shared/services/worldAnvilBaseService.ts';
import { TOKEN_EXPIRATION_SECONDS } from 'shared/constants/worldAnvilConstants.ts';
import { setUserToken } from './userToken.ts';
import type {
  User,
  World,
  ArticleResponse,
  CharacterSheet,
} from 'shared/types/worldAnvilTypes.ts';

class WorldAnvilAPIService extends WorldAnvilBaseService {
  private appKey: string;

  constructor(appKey?: string) {
    super();
    this.appKey = appKey || "";
  }

  setCredentials(userToken: string, appKey?: string) {
    super.setCredentials(userToken, appKey || this.appKey);
    if (appKey) {
      this.appKey = appKey;
    }
  }

  protected logError(message: string, ...args: any[]): void {
    console.error(message, ...args);
  }

  protected onTokenRefresh(token: string): void {
    setUserToken(token, TOKEN_EXPIRATION_SECONDS);
  }

  async logIn(userToken: string, appKey?: string): Promise<User> {
    this.setCredentials(userToken, appKey);

    try {
      const jsonResponse = await this.fetchUserIdentity();
      
      return {
        displayName: jsonResponse.username,
        id: jsonResponse.id,
        worlds: null
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async getWorlds(userId: string): Promise<World[]> {
    try {
      const jsonResponse = await this.fetchUserWorlds(userId);
      
      return jsonResponse.entities.map((world) => ({
        id: world.id,
        title: world.title,
        cssClassName: world.title.replaceAll(/\s/g, "").replace('&', 'And')
      }));
    } catch (error) {
      console.error('Failed to fetch worlds:', error);
      throw error;
    }
  }

  async getCharacterSheets(worldId: string): Promise<CharacterSheet[]> {
    const allCharacterSheets: CharacterSheet[] = [];
    const limit = 50;
    let offset = 0;
    let hasMore = true;

    const fetchPage = async (): Promise<CharacterSheet[]> => {
      const jsonResponse = await this.fetchWorldArticles(worldId, offset);
      const numArticlesInResponse = jsonResponse.entities.length;
      
      const currentArticles: CharacterSheet[] = jsonResponse.entities
        .filter((article) => 
          article.tags?.includes("character_sheet") || 
          article.customArticleTemplate?.toLowerCase().includes("character sheet")
        )
        .map((article) => ({
          articleId: article.id,
          title: article.title,
          tags: article.tags?.split(',') || []
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