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
  const { isLoggedIn, accessToken, setUser, setIsLoggedIn } = React.useContext(UserContext) as UserContextType;

  const worldInitialValues: WorldInitialValues = {
    worldIsLoading: false,
    selectedWorld: null,
    selectedTags: []
  };

  const articleInitialValues: ArticleInitialValues = {
    errorMessage: null,
    articleId: '',
    activeCharacter: '',
  }

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      if (accessToken === '') {
        setIsLoading(false)
      } else {
        worldAnvilAPI.logIn(accessToken).then(userResponse => {
          const newUser = userResponse;
          setIsLoggedIn(true);
          worldAnvilAPI.getWorlds(accessToken, userResponse.id).then(worldResponse => {
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