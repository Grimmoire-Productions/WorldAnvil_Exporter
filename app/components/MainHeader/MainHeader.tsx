import React from 'react';
import { useNavigate, useParams } from 'react-router';
import type { MultiValue } from 'react-select';
import SearchDropdown from '~/components/SearchDropdown/SearchDropdown';
import { UserContext } from '~/context/UserContext';
import type { UserContextType, DropdownOption, World } from '~/utils/types';
import styles from './MainHeader.module.css';

function MainHeader() {
  const { user, isLoggedIn } = React.useContext(UserContext) as UserContextType;
  
  const navigate = useNavigate();
  const { worldId } = useParams<{ worldId?: string }>();


  const handleSelectedWorldChange = (options: DropdownOption | MultiValue<DropdownOption>) => {
    const selectedOption = options as DropdownOption;
    navigate(`/worlds/${selectedOption.id}`);
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
              currentSelection={(() => {
                if (!worldId || !user?.worlds) return undefined;
                const currentWorld = user.worlds.find(w => w.id === worldId);
                return currentWorld ? {
                  value: currentWorld.title,
                  id: worldId,
                  label: currentWorld.title
                } : undefined;
              })()}
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