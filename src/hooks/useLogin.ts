import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import type { UserContextType } from '../utils/types';
import backendAPI from '../utils/backendAPI';
import { setUserToken } from '../utils/userToken';
import { TOKEN_EXPIRATION_SECONDS } from '../utils/consts';

export const useLogin = () => {
  const { setUser, setIsLoggedIn } = useContext(UserContext) as UserContextType;

  const login = async (accessToken: string, appKey?: string) => {
    try {
      const userResponse = await backendAPI.logIn(accessToken, appKey);
      if (userResponse.displayName) {
        // Store token in localStorage for persistence
        setUserToken(accessToken, TOKEN_EXPIRATION_SECONDS);
        
        const worlds = await backendAPI.getWorlds(userResponse.id);
        const user = { ...userResponse, worlds };
        setUser(user);
        setIsLoggedIn(true);
        return user;
      }
      throw new Error('Invalid user response');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  return { login };
};