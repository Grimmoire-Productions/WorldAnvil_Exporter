import type { 
  User, 
  World, 
  WorldArticlesResponse,
  UserWorldsResponse,
  UserIdentityResponse,
  ArticleResponse,
  CharacterSheet,
  SecretResponse 
} from '../types/index.js';

const baseURL = 'https://www.worldanvil.com/api/external/boromir';
const APPLICATION_KEY = process.env.WA_API_KEY || '';
const TOKEN_EXPIRATION_SECONDS = 24 * 60 * 60; // 24 hours

class WorldAnvilAPIService {
  private userToken: string | null = null;
  private appKey: string;

  constructor(appKey?: string) {
    this.appKey = appKey || APPLICATION_KEY;
  }

  setCredentials(userToken: string, appKey?: string) {
    this.userToken = userToken;
    if (appKey) {
      this.appKey = appKey;
    }
  }

  private getHeaders(): HeadersInit {
    if (!this.userToken) {
      throw new Error('User token not set. Call setCredentials() first.');
    }
    return {
      "x-auth-token": this.userToken,
      "x-application-key": this.appKey,
      "Content-type": "application/json"
    };
  }

  private getHeadersWithAccept(): HeadersInit {
    return {
      ...this.getHeaders(),
      "accept": "application/json"
    };
  }

  async logIn(userToken: string, appKey?: string): Promise<User> {
    this.setCredentials(userToken, appKey);

    const options: RequestInit = {
      method: "GET",
      headers: this.getHeaders()
    };

    const response = await fetch(`${baseURL}/identity`, options);
    
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('API error: ', errorResponse.error);
      throw new Error('API error');
    }

    const jsonResponse: UserIdentityResponse = await response.json();
    
    // Note: We don't call setUserToken here anymore since session management 
    // is handled by express-session
    
    return {
      displayName: jsonResponse.username,
      id: jsonResponse.id,
      worlds: null
    };
  }

  async getWorlds(userId: string): Promise<World[]> {
    const options: RequestInit = {
      method: "POST",
      headers: this.getHeadersWithAccept(),
      body: JSON.stringify({
        "limit": "50",
        "offset": "0"
      })
    };

    const response = await fetch(`${baseURL}/user/worlds?id=${userId}`, options);
    
    if (!response.ok) {
      const errorResponse = await response.json();
      if (errorResponse.error) {
        console.error('API error: ', errorResponse.error);
      } else if (errorResponse.value) {
        console.error(`${errorResponse.summary}; ${errorResponse.value.status}`);
        console.error(errorResponse.value.error);
      }
      throw new Error('API error');
    }

    const jsonResponse: UserWorldsResponse = await response.json();
    
    return jsonResponse.entities.map((world) => ({
      id: world.id,
      title: world.title,
      cssClassName: world.title.replaceAll(/\s/g, "").replace('&', 'And')
    }));
  }

  async getCharacterSheets(worldId: string): Promise<CharacterSheet[]> {
    const allCharacterSheets: CharacterSheet[] = [];
    const limit = 50;
    let offset = 0;
    let hasMore = true;

    const fetchPage = async (): Promise<CharacterSheet[]> => {
      const options: RequestInit = {
        method: "POST",
        headers: this.getHeadersWithAccept(),
        body: JSON.stringify({
          "limit": limit.toString(),
          "offset": offset.toString()
        })
      };

      const response = await fetch(`${baseURL}/world/articles?id=${worldId}`, options);
      
      if (!response.ok) {
        const errorResponse = await response.json();
        if (errorResponse.error) {
          console.error('API error: ', errorResponse.error);
        } else if (errorResponse.value) {
          console.error(`${errorResponse.summary}; ${errorResponse.value.status}`);
          console.error(errorResponse.value.error);
        }
        throw new Error('API error');
      }

      const jsonResponse: WorldArticlesResponse = await response.json();
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
    const options: RequestInit = {
      method: "GET",
      headers: this.getHeaders()
    };

    const response = await fetch(`${baseURL}/article?id=${charId}&granularity=2`, options);
    
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('API error: ', errorResponse.error);
      throw new Error('API error');
    }

    return await response.json();
  }

  async fetchSecrets(secretId: string): Promise<string> {
    const options: RequestInit = {
      method: "GET",
      headers: this.getHeaders()
    };

    const response = await fetch(`${baseURL}/secret?id=${secretId}&granularity=0`, options);
    
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('API error: ', errorResponse.error);
      throw new Error('API error');
    }

    const jsonResponse: SecretResponse = await response.json();
    return jsonResponse.content;
  }
}

// Create and export a singleton instance
const worldAnvilAPI = new WorldAnvilAPIService();
export default worldAnvilAPI;