import React, {useState, useEffect} from 'react';
import styles from './MainContainer.module.css';
import { UserContext } from '../../context/UserContext';
import type { UserContextType } from '../../utils/types';
import LoginContainer from '../LoginContainer/LoginContainer';
import worldAnvilAPI from '../../utils/worldAnvilAPI';

function MainContainer() {
  const { isLoggedIn, accessToken, setUser, setIsLoggedIn } = React.useContext(UserContext) as UserContextType;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      if (accessToken === '') {
        setIsLoading(false)
      } else {
        worldAnvilAPI.logIn(accessToken).then(userResponse => {
          setUser(userResponse);
          setIsLoggedIn(true);
        }).catch(error => {
          console.error(error)
        }).finally(() => {
          setIsLoading(false);
        })
      }
    }
  });

  return (
    <main className={styles.main}>
      {!isLoading ? (
        <LoginContainer />
      ) : (
        <div />
      )}
      {isLoggedIn ? (
        <div>
          <p>CONTENT</p>
        </div>
      ) : (<div />)}
    </main>
  );
}

export default MainContainer;