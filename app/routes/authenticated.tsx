import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';
import WorldProvider from '../context/WorldContext';
import ArticleProvider from '../context/ArticleContext';
import ExportHeader from '../containers/ExportToolContainer/ExportHeader/ExportHeader';
import type { 
  UserContextType, 
  ArticleInitialValues, 
  WorldInitialValues 
} from '../utils/types';
import styles from './authenticated.module.css';

export default function AuthenticatedLayout() {
  const { isLoggedIn } = React.useContext(UserContext) as UserContextType;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/login');
    }
  }, [isLoggedIn, navigate]);

  const worldInitialValues: WorldInitialValues = {
    worldIsLoading: false,
    selectedWorld: null,
    selectedTags: [],
    selectedRunTag: null
  };

  const articleInitialValues: ArticleInitialValues = {
    errorMessage: null,
    articleId: '',
    activeCharacter: '',
    isArticleLoading: false,
  };

  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  return (
    <WorldProvider initialValues={worldInitialValues}>
      <ArticleProvider initialValues={articleInitialValues}>
        <div className={styles.authenticated}>
          <ExportHeader />
          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
      </ArticleProvider>
    </WorldProvider>
  );
}