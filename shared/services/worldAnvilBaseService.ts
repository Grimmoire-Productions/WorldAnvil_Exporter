/**
 * Base World Anvil API service with shared functionality
 */

import { 
  WORLD_ANVIL_BASE_URL, 
  API_ENDPOINTS, 
  API_HEADERS 
} from '../constants/worldAnvilConstants';
import type { 
  UserIdentityResponse, 
  UserWorldsResponse, 
  WorldArticlesResponse, 
  ArticleResponse, 
  SecretResponse 
} from '../types/worldAnvilTypes';

export abstract class WorldAnvilBaseService {
  protected userToken: string | null = null;
  protected applicationKey: string | null = null;

  setCredentials(userToken: string, applicationKey?: string) {
    this.userToken = userToken;
    this.applicationKey = applicationKey || null;
  }

  protected getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': API_HEADERS.CONTENT_TYPE,
      'Accept': API_HEADERS.ACCEPT,
    };

    if (this.userToken) {
      headers[API_HEADERS.AUTH_TOKEN] = this.userToken;
    }

    if (this.applicationKey) {
      headers[API_HEADERS.APPLICATION_KEY] = this.applicationKey;
    }

    return headers;
  }

  protected buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(WORLD_ANVIL_BASE_URL + endpoint);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  protected async handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      this.logError(`API error - Status: ${response.status} ${response.statusText}`);
      this.logError(`URL: ${response.url}`);
      if (errorData?.error) {
        this.logError('API error:', errorData.error);
      } else if (errorData?.value) {
        this.logError(`${errorData.summary}; ${errorData.value.status}`);
        this.logError(errorData.value.error);
      } else {
        this.logError('Error response body:', errorData);
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  // Abstract methods that must be implemented by platform-specific services
  protected abstract logError(message: string, ...args: any[]): void;
  protected abstract onTokenRefresh?(token: string): void;

  // Shared API call methods
  async fetchUserIdentity(): Promise<UserIdentityResponse> {
    const url = this.buildUrl(API_ENDPOINTS.IDENTITY);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    const result = await this.handleApiResponse<UserIdentityResponse>(response);
    this.onTokenRefresh?.(this.userToken!);
    return result;
  }

  async fetchUserWorlds(userId: string): Promise<UserWorldsResponse> {
    const url = this.buildUrl(API_ENDPOINTS.USER_WORLDS, { id: userId });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        limit: "50",
        offset: "0"
      })
    });
    
    const result = await this.handleApiResponse<UserWorldsResponse>(response);
    this.onTokenRefresh?.(this.userToken!);
    return result;
  }

  async fetchWorldArticles(worldId: string, offset: number = 0): Promise<WorldArticlesResponse> {
    const url = this.buildUrl(API_ENDPOINTS.WORLD_ARTICLES, { id: worldId });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        limit: "50",
        offset: offset.toString()
      })
    });
    
    return this.handleApiResponse<WorldArticlesResponse>(response);
  }

  async fetchArticle(articleId: string, granularity: number = 2): Promise<ArticleResponse> {
    const url = this.buildUrl(API_ENDPOINTS.ARTICLE, { 
      id: articleId, 
      granularity: granularity.toString() 
    });
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    return this.handleApiResponse<ArticleResponse>(response);
  }

  async fetchSecret(secretId: string): Promise<SecretResponse> {
    const url = this.buildUrl(API_ENDPOINTS.SECRET, { 
      id: secretId, 
      granularity: '0' 
    });
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    return this.handleApiResponse<SecretResponse>(response);
  }
}