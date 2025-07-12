import React, {useState, useEffect} from 'react';
import styles from './MainContainer.module.css';
import { UserContext } from '../../context/UserContext';
import type { ArticleInitialValues, UserContextType, WorldInitialValues } from '../../utils/types';
import LoginContainer from '../LoginContainer/LoginContainer';
import ExportToolContainer from '../ExportToolContainer/ExportToolContainer';
import worldAnvilAPI from '../../utils/worldAnvilAPI';
import WorldProvider from '../../context/WorldContext';
import ArticleProvider from '../../context/ArticleContext';
function MainContainer() {
  const { isLoggedIn, accessToken, setUser, setIsLoggedIn, applicationKey } = React.useContext(UserContext) as UserContextType;

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
  }

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      // Check if dev mode is enabled
      const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';
      const devApiToken = import.meta.env.VITE_PUBLIC_WA_API_TOKEN;
      
      if (isDevMode && devApiToken) {
        // Use real API with dev token for dev mode
        worldAnvilAPI.logIn(devApiToken, applicationKey || undefined).then(userResponse => {
          const newUser = userResponse;
          setIsLoggedIn(true);
          worldAnvilAPI.getWorlds(devApiToken, userResponse.id, applicationKey || undefined).then(worldResponse => {
            newUser.worlds = worldResponse
            setUser(newUser)
            setIsLoading(false);
          }).catch(error => {
            console.error('Failed to fetch worlds in dev mode:', error)
            setIsLoading(false);
          })
        }).catch(error => {
          console.error('Failed to login in dev mode:', error)
          setIsLoading(false);
        })
      } else if (accessToken === '') {
        setIsLoading(false)
      } else {
        worldAnvilAPI.logIn(accessToken, applicationKey || undefined).then(userResponse => {
          const newUser = userResponse;
          setIsLoggedIn(true);
          worldAnvilAPI.getWorlds(accessToken, userResponse.id, applicationKey || undefined).then(worldResponse => {
            newUser.worlds = worldResponse
            setUser(newUser)
          }).catch(error => {
            console.error(error)
          })
        }).catch(error => {
          console.error(error)
        }).finally(() => {
          setIsLoading(false);
        })
      }
    }
  });

  const getInitialScreen = () => {
    if (!isLoading) {
      return (
        isLoggedIn ?
          <WorldProvider initialValues={worldInitialValues}>
            <ArticleProvider initialValues={articleInitialValues}>
                <ExportToolContainer />
            </ArticleProvider>
          </WorldProvider>
          : <LoginContainer />
      )
    } else {
      return <div />
    }
  }

  return (
    <div className={styles.main}>
      {getInitialScreen()}
    </div>
  );
}

export default MainContainer;