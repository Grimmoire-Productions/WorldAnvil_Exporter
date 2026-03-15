export interface ArticleContextType {
  articleId: string;
  setArticleId: (value: React.SetStateAction<string>) => void;
  activeCharacter: string;
  setActiveCharacter: (value: React.SetStateAction<string>) => void;
  errorMessage: string | null;
  setErrorMessage: (value: React.SetStateAction<string | null>) => void;
  isArticleLoading: boolean;
  setIsArticleLoading: (value: React.SetStateAction<boolean>) => void;
  fetchAndProcessCharacter: (
    articleId: string,
    selectedWorldKey: string,
  ) => void;
}

export interface ArticleInitialValues {
  errorMessage: string | null;
  articleId: string;
  activeCharacter: string;
  isArticleLoading: boolean;
}

export interface CharacterSheet {
  articleId: string;
  title: string;
  tags: string[];
}

export interface DropdownOption {
  value: string;
  id: string;
  label: string;
}

export interface User {
  displayName: string;
  id: string;
  worlds: World[] | null;
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
  applicationKey: string | null;
  setApplicationKey: (value: React.SetStateAction<string | null>) => void;
  isAutoLoginPending: boolean;
  setIsAutoLoginPending: (value: React.SetStateAction<boolean>) => void;
  isAutoLoginInProgress: boolean;
  setIsAutoLoginInProgress: (value: React.SetStateAction<boolean>) => void;
}

export interface UserInitialValues {
  isLoggedIn: boolean;
  accessToken: string;
  expiresAt: number | null;
  user: User | null;
  applicationKey: string | null;
  isAutoLoginPending: boolean;
  isAutoLoginInProgress: boolean;
}

export interface UserToken {
  expiry: number;
  value: string;
}

export interface World {
  id: string;
  title: string;
  cssClassName: string;
  characterSheets?: CharacterSheet[] | null;
  tags?: string[] | null;
}

export interface WorldInitialValues {
  worldIsLoading: boolean;
  selectedWorld: World | null;
}

export interface WorldContextType {
  worldIsLoading: boolean;
  setWorldIsLoading: (value: React.SetStateAction<boolean>) => void;
  selectedWorld: World | null;
  setSelectedWorld: (value: React.SetStateAction<World | null>) => void;
}

// World Anvil API Response Data

export interface ArticleResponse {
  id: string;
  title: string;
  slug: string;
  state: "public" | "private";
  entityClass: string;
  icon: string | null;
  url: string;
  tags: string | null;
  templateType: string;
  customArticleTemplate: {
    id: string;
    title: string;
  } | null;
  content: string;
  footnotes: string;
  fullfooter: string;
  subheading: string | null;
}
export interface BaseWorldAnvilResponse {
  success: boolean;
}

export interface SecretResponse {
  id: string;
  title: string;
  url: string;
  content?: string;
}
export interface UserWorldsResponse extends BaseWorldAnvilResponse {
  entities: World[];
}

export interface UserIdentityResponse extends BaseWorldAnvilResponse {
  username: string;
  id: string;
}

export interface WorldArticlesResponse extends BaseWorldAnvilResponse {
  entities: ArticleResponse[];
}
