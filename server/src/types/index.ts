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
  entities: Array<{
    id: string;
    title: string;
    tags?: string;
    customArticleTemplate?: string;
  }>;
}

export interface ArticleResponse {
  id: string;
  title: string;
  content: string;
  footnotes?: string;
}

export interface SecretResponse {
  content: string;
}

// Session types
declare module 'express-session' {
  interface SessionData {
    userToken?: string;
    appKey?: string;
    userId?: string;
  }
}