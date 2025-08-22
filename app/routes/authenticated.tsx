import { Outlet } from 'react-router';
import styles from './authenticated.module.css';
import MainHeader from '../components/MainHeader/MainHeader';
export default function AuthenticatedRoute() {

  return (
    <div className={styles.authenticated}>
      <MainHeader/>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
