export interface User {
  displayName: string;
  id: string;
  worlds: World[] | null;
}

export interface UserInitialValues {
  isLoggedIn: boolean;
  accessToken: string;
  expiresAt: number | null;
  user: User | null;
}

export interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: React.SetStateAction<boolean>) => void;
  user: User | null;
  setUser: (value: React.SetStateAction<User | null>) => void;
  accessToken: string;
  setAccessToken: (value: React.SetStateAction<string>) => void;
  expiresAt: number | null;
  setExpiresAt: (value: React.SetStateAction<number | null>) => void;
}

export interface UserToken {
  expiry: number;
  value: string;
}

export interface World {
  id: string,
  title: string,
  cssClassName: string,
}

export interface WorldInitialValues {
  selectedWorld: World | null;
}

export interface WorldContextType {
  selectedWorld: World | null;
  setSelectedWorld: (value: React.SetStateAction<World | null>) => void;
}

export interface ArticleContextType {
  articleId: string;
  setArticleId: (value: React.SetStateAction<string>) => void;
  activeCharacter: string;
  setActiveCharacter: (value: React.SetStateAction<string>) => void;
  errorMessage: string | null;
  setErrorMessage: (value: React.SetStateAction<string | null>) => void;
  fetchAndProcessCharacter: (
    userToken: string,
    articleId: string,
    selectedWorldKey: string,
  ) => void;
}

export interface ArticleInitialValues {
  errorMessage: string | null;
  articleId: string;
  activeCharacter: string;
}

// World Anvil Response Data

export interface BaseWorldAnvilResponse {
  success: boolean;
}

export interface UserWorldsResponse extends BaseWorldAnvilResponse {
  entities: World[]
}

export interface UserIdentityResponse extends BaseWorldAnvilResponse {
  username: string;
  id: string;
}

export interface ArticleResponse {
  id: string,
  title: string,
  slug: string,
  state: 'public' | 'private',
  entityClass: string,
  icon: string | null,
  url: string,
  folderId: string,
  tags: string | null,
  templateType: string,
  customArticleTemplate?: string | null,
  content: string,
  category: {
    id: string,
    title: string,
    slug: string,
    url: string,
    tags: string | null,
  },
  footnotes: string,
  fullfooter: string,
  subheading: string | null,
  secrets: SecretResponse[]
}

export interface SecretResponse {
  id: string,
  title: string,
  url: string,
  content?: string,
}