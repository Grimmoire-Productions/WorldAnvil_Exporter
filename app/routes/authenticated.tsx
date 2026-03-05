import { Outlet } from 'react-router';
import styles from './authenticated.module.css';
import MainHeader from '~/features/MainHeader/MainHeader';
import WorldProvider from '~/context/WorldContext';
import type { WorldInitialValues } from '~/utils/types';

export default function AuthenticatedRoute() {
  const worldInitialValues: WorldInitialValues = {
    worldIsLoading: false,
    selectedWorld: null,
  };

  return (
    <WorldProvider initialValues={worldInitialValues}>
      <div className={styles.authenticated}>
        <MainHeader />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </WorldProvider>
  );
}
