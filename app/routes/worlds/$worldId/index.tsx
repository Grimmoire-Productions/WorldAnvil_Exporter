import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { WorldContext } from '~/context/WorldContext/WorldContext';
import type { WorldContextType } from '~/utils/types';
import styles from './index.module.css';

export default function WorldIdPage() {
  const { worldId } = useParams<{ worldId: string }>();
  const navigate = useNavigate();
  const { selectedWorld } = React.useContext(WorldContext) as WorldContextType;

  const handleSingleExportClick = () => {
    if (worldId) {
      navigate(`/worlds/${worldId}/export`);
    }
  };

  const handleBatchExportClick = () => {
    if (worldId) {
      navigate(`/worlds/${worldId}/batchExport`);
    }
  };

  return (
    <div className={styles.worldPage}>
      <div className={styles.container}>
        {selectedWorld ? (
          <>
            <h2 className={styles.worldTitle}>{selectedWorld.title}</h2>
            <button
              onClick={handleSingleExportClick}
              className={styles.exportButton}
            >
              Single Article Export
            </button>
            <button
              onClick={handleBatchExportClick}
              className={styles.exportButton}
            >
              Batch Export
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