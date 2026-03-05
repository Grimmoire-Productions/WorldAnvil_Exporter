import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { WorldContext } from '~/context/WorldContext';
import type { WorldContextType } from '~/utils/types';
import styles from './index.module.css';

export default function WorldIdPage() {
  const { worldId } = useParams<{ worldId: string }>();
  const navigate = useNavigate();
  const { selectedWorld } = React.useContext(WorldContext) as WorldContextType;

  const handleExportClick = () => {
    if (worldId) {
      navigate(`/worlds/${worldId}/export`);
    }
  };

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