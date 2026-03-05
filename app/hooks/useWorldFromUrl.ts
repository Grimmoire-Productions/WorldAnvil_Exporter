import { useMemo } from 'react';
import type { World } from '~/utils/types';

/**
 * Derives the selected world from URL worldId parameter and available worlds.
 * Returns the world object if found, null otherwise.
 * This eliminates the need for Effects to sync world state with URL.
 */
export const useWorldFromUrl = (
  worldId: string | undefined,
  worlds: World[] | undefined | null
): World | null => {
  return useMemo(() => {
    if (!worldId || !worlds) return null;
    return worlds.find(w => w.id === worldId) || null;
  }, [worldId, worlds]);
};
