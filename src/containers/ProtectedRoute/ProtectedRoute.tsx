import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { UserContext } from '../../context/UserContext';
import WorldProvider from '../../context/WorldContext';
import ArticleProvider from '../../context/ArticleContext';
import type { UserContextType, WorldInitialValues, ArticleInitialValues } from '../../utils/types';
import { useLogin } from '../../hooks/useLogin';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';
import MainHeader from '../../components/MainHeader/MainHeader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, accessToken, applicationKey } = useContext(UserContext) as UserContextType;
  const { login } = useLogin();
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (isLoading && !authChecked) {
      if (accessToken === '') {
        setIsLoading(false);
        setAuthChecked(true);
      } else if (!isLoggedIn) {
        login(accessToken, applicationKey || undefined)
          .then(() => {
            setAuthChecked(true);
          })
          .catch(error => {
            console.error('Auto-login failed:', error);
            setAuthChecked(true);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
        setAuthChecked(true);
      }
    }
  }, [isLoading, authChecked, accessToken, applicationKey, isLoggedIn, login]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingAnimation />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

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

  return (
    <WorldProvider initialValues={worldInitialValues}>
      <ArticleProvider initialValues={articleInitialValues}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <MainHeader />
          <div style={{ flex: 1 }}>
            {children}
          </div>
        </div>
      </ArticleProvider>
    </WorldProvider>
  );
}

export default ProtectedRoute;