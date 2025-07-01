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
    fetchCharacter,
  } = React.useContext(ArticleContext) as ArticleContextType;

  const {
    selectedWorld
  } = React.useContext(WorldContext) as WorldContextType

  const {
    accessToken
  } = React.useContext(UserContext) as UserContextType;
  
  const handleArticleIdChange  = (e: React.FormEvent<HTMLInputElement>) =>
    setArticleId(e.currentTarget.value);

  const handleSubmit = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.preventDefault();

      if (articleId === '') {
        return;
      }
    
    fetchCharacter(accessToken, articleId)
  };

  return (
    <div className={styles.Exporter}>

      <div>
        <ExportHeader articleId={articleId} handleArticleIdChange={handleArticleIdChange} onSubmit={handleSubmit} />
      </div>
      <div>
        <CharacterSheet activeCharacter={activeCharacter} cssClassName={selectedWorld?.cssClassName || 'default'} />
      </div>
    </div>
  );
}

export default ExportToolContainer;