import React, {useState, useEffect} from 'react';
import styles from './ExportToolContainer.module.css';
import ExportHeader from './ExportHeader/ExportHeader'
import CharacterSheet from '../../components/CharacterSheet/CharacterSheet'
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import { ArticleContext }  from '../../context/ArticleContext';
import type { ArticleContextType, WorldContextType } from '../../utils/types';
import { WorldContext } from '../../context/WorldContext';

function ExportToolContainer() {
  const {
    activeCharacter,
    isArticleLoading,
  } = React.useContext(ArticleContext) as ArticleContextType;

  const {
    selectedWorld,
  } = React.useContext(WorldContext) as WorldContextType

  return (
    <div className={styles.Exporter}>
      <div>
        <ExportHeader />
      </div>
      {isArticleLoading ? (
        <div className={styles.LoadingArticleContainer}>
          <LoadingAnimation />
        </div>
      ) : (
        <div className={styles.CharacterSheet}>
          <CharacterSheet
            activeCharacter={activeCharacter}
            cssClassName={selectedWorld?.cssClassName || "default"}
          />
        </div>
      )}
    </div>
  );
}

export default ExportToolContainer;