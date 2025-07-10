import React, {useState, useEffect} from 'react';
import styles from './ExportToolContainer.module.css';
import ExportHeader from '../../components/ExportHeader/ExportHeader'
import CharacterSheet from '../../components/CharacterSheet/CharacterSheet'
import { ArticleContext }  from '../../context/ArticleContext';
import type { ArticleContextType, UserContextType, WorldContextType } from '../../utils/types';
import { UserContext } from '../../context/UserContext';
import { WorldContext } from '../../context/WorldContext';

function ExportToolContainer() {
  const {
    articleId,
    setArticleId,
    activeCharacter,
    fetchAndProcessCharacter,
  } = React.useContext(ArticleContext) as ArticleContextType;

  const {
    selectedWorld
  } = React.useContext(WorldContext) as WorldContextType

  const {
    accessToken
  } = React.useContext(UserContext) as UserContextType;
  
  const selectedWorldKey = selectedWorld?.cssClassName || 'default'
  const handleArticleIdChange  = (e: React.FormEvent<HTMLInputElement>) =>
    setArticleId(e.currentTarget.value);

  const handleSubmit = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.preventDefault();

      if (articleId === '') {
        return;
      }
    
      fetchAndProcessCharacter(accessToken, articleId, selectedWorldKey)
  };

  return (
    <div className={styles.Exporter}>
      <div>
        <ExportHeader articleId={articleId} handleArticleIdChange={handleArticleIdChange} onSubmit={handleSubmit} />
      </div>
      <div className={styles.CharacterSheet}>
        <CharacterSheet activeCharacter={activeCharacter} cssClassName={selectedWorldKey} />
      </div>
    </div>
  );
}

export default ExportToolContainer;