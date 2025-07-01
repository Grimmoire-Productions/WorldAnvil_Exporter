import React, {useRef, useState} from 'react';
import type { UserContextType, WorldContextType } from '../../utils/types';
import WorldSelector from '../WorldSelector/WorldSelector';
import {UserContext } from '../../context/UserContext';
import {WorldContext} from '../../context/WorldContext';
import styles from '../../containers/ExportToolContainer/ExportToolContainer.module.css';


type ExportHeaderProps = {
  articleId: string;
  handleArticleIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function ExportHeader({ articleId, handleArticleIdChange, onSubmit }: ExportHeaderProps) {
  
  const { user } = React.useContext(UserContext) as UserContextType;
  const { selectedWorld } = React.useContext(WorldContext) as WorldContextType;

  const worlds = user?.worlds;
  const refArticleId = useRef(null);

  return (
    <div className={styles.ExportHeader}>
      <div className={'worldSelector'}>
        {worlds && <WorldSelector worlds={worlds} />}
      </div>
      <div>
        {selectedWorld?.title && <p>{selectedWorld.title}</p>}
      </div>
      <div id='userInput'>
      <label>Article ID: <input type='text' id='articleId' data-testid="articleId" name='Article ID' ref={refArticleId} value={articleId} onChange={handleArticleIdChange} placeholder="enter an article Id"/></label>
      <button
          className={'submit'}
          onClick={onSubmit}
          data-testid="set-article-id-button"
        >
          <span>Submit</span>
        </button>
        </div>
      <div className={'username'}>
        <p>Logged in as {user?.displayName}</p>
      </div>
    </div>
  )
};

export default ExportHeader;