import { useContext } from 'react';
import { UserContext } from '~/context/UserContext';
import type { User, UserContextType } from '~/utils/types';
import backendAPI from '~/utils/backendAPI';
import { setUserToken } from '~/utils/userToken';
import { TOKEN_EXPIRATION_SECONDS } from '~/utils/consts';
import {mockUser} from '~/context/__mocks__/mockUserData'

export const useLogin = () => {
  const { setUser, setIsLoggedIn } = useContext(UserContext) as UserContextType;

  
  const login = async (accessToken: string, appKey?: string) => {
    const MOCK_SERVER = import.meta.env.VITE_MOCK_SERVER;

    // if (MOCK_SERVER) {
    //   setUser(mockUser);
    //   setIsLoggedIn(true);
    //   return mockUser;
    // }
    try {
      const userResponse = await backendAPI.logIn(accessToken, appKey);
      if (userResponse.displayName) {
        // Store token in localStorage for persistence
        setUserToken(accessToken, TOKEN_EXPIRATION_SECONDS);
        
        const worlds = await backendAPI.getWorlds(userResponse.id);
        const user: User = { ...userResponse, worlds };
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