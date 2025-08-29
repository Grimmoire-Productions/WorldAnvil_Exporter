import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { UserContext } from '~/context/UserContext';
import { WorldContext } from '~/context/WorldContext';
import type { UserContextType, WorldContextType } from '~/utils/types';
import LoadingAnimation from '~/components/LoadingAnimation/LoadingAnimation';
import backendAPI from '~/utils/backendAPI';
import styles from './index.module.css';

export default function WorldIdPage() {
  const { worldId } = useParams<{ worldId: string }>();
  const { user } = React.useContext(UserContext) as UserContextType;
  const navigate = useNavigate();
  const loadingWorldRef = useRef<string>('');
  const {
    worldIsLoading,
    setWorldIsLoading,
    selectedWorld,
    setSelectedTags,
    setSelectedRunTag,
  } = React.useContext(WorldContext) as WorldContextType;
  
  useEffect(() => {
      if (!worldId || !user?.worlds ) return;

      // Prevent concurrent loading of the same world
      if (loadingWorldRef.current === worldId) return;

      if (!selectedWorld) return;

      // Clear previous selections
      setSelectedTags([]);
      setSelectedRunTag(null);

      if (!selectedWorld.characterSheets || !selectedWorld.tags) {
        loadingWorldRef.current = worldId;
        setWorldIsLoading(true);
        try {
          backendAPI.getCharacterSheets(selectedWorld.id).then((results) => {
            if (results.length > 0) {
              selectedWorld.characterSheets = results;
              const tagSet = new Set(results.map((sheet) => sheet.tags).flat());
              selectedWorld.tags = [...tagSet];
            }
          })
        } catch (error) {
          console.error("Failed to load world data:", error);
        } finally {
          setWorldIsLoading(false);
          loadingWorldRef.current = "";
        }
    };
  }, [
    worldId,
    selectedWorld,
    setWorldIsLoading,
  ]);

  const handleExportClick = () => {
    if (worldId) {
      navigate(`/worlds/${worldId}/export`);
    }
  };

  if (worldIsLoading) {
    return (
      <div className={styles.worldPage}>
        <div className={styles.loadingContainer}>
          <LoadingAnimation />
          <p className={styles.loadingText}>Loading world data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.worldPage}>
      <div className={styles.container}>
        {selectedWorld ? (
          <>
            <h2 className={styles.worldTitle}>
              {selectedWorld.title}
            </h2>
              <button 
                onClick={handleExportClick}
                className={styles.exportButton}
              >
                Go to Export Tool
              </button>
          </>
        ) : (
          <div className={styles.loadingMessage}>
            Select a world from the dropdown above to begin
          </div>
        )}
      </div>
    </div>
  );
}