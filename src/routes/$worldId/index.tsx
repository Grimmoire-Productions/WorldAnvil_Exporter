import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { UserContext } from '../../context/UserContext';
import { WorldContext } from '../../context/WorldContext';
import type { UserContextType, WorldContextType } from '../../utils/types';
import ExportHeader from '../../containers/ExportToolContainer/ExportHeader/ExportHeader';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';
import backendAPI from '../../utils/backendAPI';
import styles from './index.module.css';

function WorldIdPage() {
  const { worldId } = useParams<{ worldId: string }>();
  const { user, setUser } = React.useContext(UserContext) as UserContextType;
  const navigate = useNavigate();
  const { 
    selectedWorld, 
    setSelectedWorld,
    setSelectedTags,
    setSelectedRunTag,
  } = React.useContext(WorldContext) as WorldContextType;
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load world data when worldId changes
    const loadWorld = async () => {
      if (!worldId || !user?.worlds) return;
      
      // Clear previous selections
      setSelectedTags([]);
      setSelectedRunTag(null);
      
      const world = user.worlds.find(w => w.id === worldId);
      if (!world) return;

      // If world doesn't have character sheets loaded, fetch them
      if (!world.characterSheets || !world.tags) {
        setIsLoading(true);
        try {
          const results = await backendAPI.getCharacterSheets(world.id);
          if (results.length > 0) {
            world.characterSheets = results;
            // Get set of unique tags
            const tagSet = new Set(results.map((sheet) => sheet.tags).flat());
            world.tags = [...tagSet];
          }
          
          // Update the world in user context
          const updatedWorlds = [...user.worlds];
          const worldIndex = updatedWorlds.findIndex(w => w.id === world.id);
          if (worldIndex >= 0) {
            updatedWorlds[worldIndex] = world;
            setUser(prevUser => {
              if (prevUser === null) {
                return null;
              }
              return {
                ...prevUser,
                worlds: updatedWorlds
              };
            });
          }
          
          setSelectedWorld(world);
        } catch (error) {
          console.error('Failed to load world data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // World already has data, just select it
        setSelectedWorld(world);
      }
    };

    loadWorld();
  }, [worldId, user?.worlds]);

  const handleExportClick = () => {
    if (worldId) {
      navigate(`/${worldId}/export`);
    }
  };

  if (isLoading) {
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

export default WorldIdPage;