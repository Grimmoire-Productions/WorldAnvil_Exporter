/**
 * Shared types between frontend and backend for World Anvil API integration
 */

// Core domain types
export interface User {
  displayName: string;
  id: string;
  worlds: World[] | null;
}

export interface World {
  id: string;
  title: string;
  cssClassName: string;
  characterSheets?: CharacterSheet[];
  tags?: string[];
}

export interface CharacterSheet {
  articleId: string;
  title: string;
  tags: string[];
}

export interface Article {
  articleId: string;
  title: string;
  tags: string[];
}

// World Anvil API Response types
export interface UserIdentityResponse {
  username: string;
  id: string;
}

export interface UserWorldsResponse {
  entities: Array<{
    id: string;
    title: string;
  }>;
}

export interface WorldArticlesResponse {
  entities: Array<ArticleResponse>;
}

export interface ArticleResponse {
  id: string;
  title: string;
  content: string;
  footnotes?: string;
  customArticleTemplate?: string;
  tags?: string;
}

export interface SecretResponse {
  content: string;
}

// Authentication types
export interface LoginRequest {
  userToken: string;
  appKey?: string;
}

export interface LoginResponse {
  user: User;
  sessionId?: string;
}

export interface SessionCheckResponse {
  authenticated: boolean;
  userId?: string;
}

export interface CredentialsCheckResponse {
  hasAppKey: boolean;
}