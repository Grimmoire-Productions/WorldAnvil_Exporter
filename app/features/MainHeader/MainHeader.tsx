import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { MultiValue } from 'react-select';
import SearchDropdown from '~/components/SearchDropdown/SearchDropdown';
import { UserContext } from '~/context/UserContext';
import type {
  UserContextType,
  DropdownOption,
  World,
  WorldContextType,
} from "~/utils/types";
import styles from './MainHeader.module.css';
import { WorldContext } from '~/context/WorldContext';
import { useLogout } from '~/hooks/useLogout';
function MainHeader() {
  const { user, isLoggedIn } = React.useContext(UserContext) as UserContextType;
  
  const navigate = useNavigate();
  const { worldId } = useParams<{ worldId?: string }>();
  const { logout } = useLogout();

  const {
    selectedWorld,
    setSelectedWorld,
  } = React.useContext(WorldContext) as WorldContextType;

  useEffect(() => {
    if (worldId && user?.worlds && !selectedWorld) {
      const world = user.worlds.find(w => w.id === worldId);
      if (world) {
        setSelectedWorld(world);
      }
    }
  }, [worldId, user?.worlds, selectedWorld, setSelectedWorld]);

  const handleSelectedWorldChange = (options: DropdownOption | MultiValue<DropdownOption>) => {
    const selectedOption = options as DropdownOption;

    // Only proceed if a different world is selected
    if (selectedWorld?.id === selectedOption.id) {
      return; // Do nothing if the same world is selected
    }

    if (user && user.worlds) {
      const worldIndex = user.worlds.findIndex(
        (world) => world.id === selectedOption.id,
      );

      if (worldIndex >= 0) {
        const world = user.worlds[worldIndex]

        setSelectedWorld(world);
        navigate(`/worlds/${world.id}`);
      }
    } 
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

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/auth/login');
    } else {
      console.error('Logout failed:', result.error);
      // Still navigate to login even if logout failed to avoid stuck state
      navigate('/auth/login');
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>
          World Anvil Character Sheet Export Tool
        </h1>

        <div className={styles.controls}>
          {user?.worlds ? (
            <SearchDropdown
              id="select-world"
              className="select-world"
              placeholder="--Choose a World--"
              items={worldDropdownOptions(user.worlds)}
              isMultiSelect={false}
              error="No worlds available"
              handleChange={handleSelectedWorldChange}
              currentSelection={
                selectedWorld
                  ? {
                      value: selectedWorld.title,
                      id: selectedWorld.id,
                      label: selectedWorld.title,
                    }
                  : undefined
              }
            />
          ) : isLoggedIn ? (
            <div>Loading worlds...</div>
          ) : null}

          <div className={styles.userInfo}>
            <span>Logged in as {user?.displayName || 'Loading...'}</span>
            <span className={styles.logoutButton} onClick={handleLogout}>Logout</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default MainHeader;