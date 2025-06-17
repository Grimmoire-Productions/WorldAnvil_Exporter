export interface User {
  displayName: string;
  id: string;
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

export interface UserIdentityResponse {
  success: boolean;
  username: string;
  id: string;
}

export interface UserToken {
  expiry: number;
  value: string;
}