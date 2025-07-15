import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import type { UserContextType } from '../utils/types';
import backendAPI from '../utils/backendAPI';

export const useLogin = () => {
  const { setUser, setIsLoggedIn } = useContext(UserContext) as UserContextType;

  const login = async (accessToken: string, appKey?: string) => {
    try {
      const userResponse = await backendAPI.logIn(accessToken, appKey);
      if (userResponse.displayName) {
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