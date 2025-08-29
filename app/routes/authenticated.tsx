import { Outlet } from 'react-router';
import styles from './authenticated.module.css';
import WorldProvider from '~/context/WorldContext';
import type { WorldInitialValues } from '~/utils/types';

export default function AuthenticatedRoute() {
  const worldInitialValues: WorldInitialValues = {
    worldIsLoading: false,
    selectedWorld: null,
    selectedTags: [],
    selectedRunTag: null,
  };

  return (
    <WorldProvider initialValues={worldInitialValues}>
      <div className={styles.authenticated}>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </WorldProvider>
  );
}
