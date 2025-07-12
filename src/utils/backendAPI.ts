import type {
  User,
  World,
  CharacterSheet,
} from './types';

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Backend API service for World Anvil Exporter
 * 
 * This service handles all communication with our Express backend,
 * which in turn communicates with the World Anvil API.
 * 
 * Authentication and credentials are managed server-side through
 * express-session, so no credential management is needed here.
 */
class BackendAPIService {
  private sessionId: string | null = null;

  private async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Include cookies for session management
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Request failed: ${response.status}`);
    }

    return response;
  }

  async logIn(userToken: string, appKey?: string): Promise<User> {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ userToken, appKey }),
    });

    const data = await response.json();
    this.sessionId = data.sessionId;
    return data.user;
  }

  async logout(): Promise<void> {
    await this.request('/api/auth/logout', {
      method: 'POST',
    });
    this.sessionId = null;
  }

  async checkSession(): Promise<{ authenticated: boolean; userId?: string }> {
    const response = await this.request('/api/auth/session');
    return await response.json();
  }

  async getWorlds(userId: string): Promise<World[]> {
    const response = await this.request(`/api/worlds/${userId}`);
    return await response.json();
  }

  async getCharacterSheets(worldId: string): Promise<CharacterSheet[]> {
    const response = await this.request(`/api/worlds/${worldId}/characters`);
    return await response.json();
  }

  async fetchCharacterRaw(charId: string) {
    const response = await this.request(`/api/characters/${charId}/raw`);
    return await response.json();
  }

  // Removed - processing will be done in frontend

  async fetchSecrets(secretId: string): Promise<{ content: string }> {
    const response = await this.request(`/api/characters/secrets/${secretId}`);
    return await response.json();
  }

  // Legacy compatibility methods to match the old API
  async fetchCharacter(charId: string) {
    return this.fetchCharacterRaw(charId);
  }

}

// Create and export a singleton instance
const backendAPI = new BackendAPIService();
export default backendAPI;