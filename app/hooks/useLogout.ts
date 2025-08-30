import { useContext } from 'react';
import { UserContext } from '~/context/UserContext';
import { WorldContext } from '~/context/WorldContext';
import type { UserContextType, WorldContextType } from '~/utils/types';
import backendAPI from '~/utils/backendAPI';
import { clearUserToken } from '~/utils/userToken';

export const useLogout = () => {
  const {
    setIsLoggedIn,
    setUser,
    setAccessToken,
    setExpiresAt,
    setApplicationKey,
    setIsAutoLoginPending,
    setIsAutoLoginInProgress,
  } = useContext(UserContext) as UserContextType;

  const {
    setSelectedWorld,
    setSelectedTags,
    setSelectedRunTag,
    setWorldIsLoading,
  } = useContext(WorldContext) as WorldContextType;

  const logout = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      // Call backend API to destroy server session
      await backendAPI.logout();

      // Clear token from localStorage
      clearUserToken();

      // Reset all UserContext state to initial values
      setIsLoggedIn(false);
      setUser(null);
      setAccessToken('');
      setExpiresAt(null);
      setApplicationKey(null);
      setIsAutoLoginPending(false);
      setIsAutoLoginInProgress(false);

      // Reset all WorldContext state to initial values
      setSelectedWorld(null);
      setSelectedTags(null);
      setSelectedRunTag(null);
      setWorldIsLoading(false);

      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Logout failed' 
      };
    }
  };

  return { logout };
};