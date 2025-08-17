import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { MultiValue } from 'react-select';
import SearchDropdown from '../SearchDropdown/SearchDropdown';
import { UserContext } from '../../context/UserContext';
import { WorldContext } from '../../context/WorldContext';
import type { UserContextType, WorldContextType, DropdownOption, World } from '../../utils/types';
import backendAPI from '../../utils/backendAPI';
import styles from './MainHeader.module.css';

function MainHeader() {
  const { user, setUser, isLoggedIn } = React.useContext(UserContext) as UserContextType;
  const { 
    worldIsLoading, 
    setWorldIsLoading, 
    selectedWorld, 
    setSelectedWorld,
    setSelectedTags,
    setSelectedRunTag,
  } = React.useContext(WorldContext) as WorldContextType;
  
  const navigate = useNavigate();
  const { worldId } = useParams<{ worldId?: string }>();

  const handleWorldSelection = useCallback(async (world: World) => {
    if (!world.characterSheets || !world.tags) {
      setWorldIsLoading(true);
      try {
        const results = await backendAPI.getCharacterSheets(world.id);
        if (results.length > 0) {
          world.characterSheets = results;
          // Get set of unique tags
          const tagSet = new Set(results.map((sheet) => sheet.tags).flat());
          world.tags = [...tagSet];
        }
        setSelectedWorld(world);
        
        // Update user's worlds in context
        if (user?.worlds) {
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
        }
      } finally {
        setWorldIsLoading(false);
      }
    } else {
      setSelectedWorld(world);
    }
  }, [user?.worlds, setUser, setSelectedWorld, setWorldIsLoading]);

  useEffect(() => {
    // Sync selected world with URL worldId
    if (worldId && user?.worlds) {
      const world = user.worlds.find(w => w.id === worldId);
      if (world && (!selectedWorld || selectedWorld.id !== worldId)) {
        handleWorldSelection(world);
      }
    } else if (!worldId && selectedWorld) {
      // Clear selected world if no worldId in URL
      setSelectedWorld(null);
      setSelectedTags([]);
      setSelectedRunTag(null);
    }
  }, [worldId, user?.worlds, selectedWorld?.id, handleWorldSelection, setSelectedWorld, setSelectedTags, setSelectedRunTag]);

  const handleSelectedWorldChange = (options: DropdownOption | MultiValue<DropdownOption>) => {
    const selectedOption = options as DropdownOption;

    // Only proceed if a different world is selected
    if (selectedWorld?.id === selectedOption.id) {
      return;
    }

    // Navigate immediately to the world-specific route
    navigate(`/${selectedOption.id}`);
  };

  const worldDropdownOptions = (worlds: World[]): DropdownOption[] => {
    const options: DropdownOption[] = [];
    worlds.forEach((world: World) => {
      options.push({
        value: world.title,
        id: world.id,
        label: world.title
      });
    });
    return options;
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>World Anvil Character Sheet Export Tool</h1>
        
        <div className={styles.controls}>
          {user?.worlds && (
            <SearchDropdown
              id="select-world"
              className="select-world"
              placeholder="--Choose a World--"
              items={worldDropdownOptions(user.worlds)}
              isMultiSelect={false}
              error="No worlds available"
              handleChange={handleSelectedWorldChange}
              currentSelection={selectedWorld ? {
                value: selectedWorld.title,
                id: selectedWorld.id,
                label: selectedWorld.title
              } : undefined}
            />
          )}
          
          <div className={styles.userInfo}>
            <span>Logged in as {user?.displayName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default MainHeader;