import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import CharacterSheet from '~/features/ArticleExport/CharacterSheet/CharacterSheet';
import LoadingAnimation from '~/components/LoadingAnimation/LoadingAnimation';
import { ArticleContext } from '~/context/ArticleContext/ArticleContext';
import { WorldContext } from '~/context/WorldContext/WorldContext';
import type { ArticleContextType, WorldContextType } from '~/utils/types';

export default function CharacterSheetPage() {
  const { worldId, articleId } = useParams<{ worldId: string; articleId: string }>();
  const navigate = useNavigate();
  const lastFetchedRef = useRef<string>('');

  const {
    activeCharacter,
    isArticleLoading,
    fetchAndProcessCharacter,
  } = React.useContext(ArticleContext) as ArticleContextType;

  const { selectedWorld } = React.useContext(WorldContext) as WorldContextType;

  // Fetch character data when articleId and selectedWorld are available
  // URL param is the source of truth - no need to sync to context state
  useEffect(() => {
    if (articleId && selectedWorld && !isArticleLoading) {
      const fetchKey = `${articleId}-${selectedWorld.cssClassName || "default"}`;

      // Prevent duplicate requests for the same character
      if (lastFetchedRef.current !== fetchKey) {
        lastFetchedRef.current = fetchKey;
        const selectedWorldKey = selectedWorld.cssClassName || "default";
        fetchAndProcessCharacter(articleId, selectedWorldKey);
      }
    }
  }, [articleId, selectedWorld, fetchAndProcessCharacter, isArticleLoading]);

  useEffect(() => {
    // Redirect to world page if no articleId
    if (!articleId && worldId) {
      navigate(`/worlds/${worldId}`);
    }
  }, [articleId, worldId, navigate]);

  if (isArticleLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <LoadingAnimation />
        <p style={{ marginTop: '1rem', color: '#666' }}>Loading character sheet...</p>
      </div>
    );
  }

  if (!activeCharacter) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: '#666', fontSize: '1.2rem' }}>
          No character data available. Please select a character from the export page.
        </div>
      </div>
    );
  }

  return (
    <div>
      <CharacterSheet
        activeCharacter={activeCharacter}
        cssClassName={selectedWorld?.cssClassName || "default"}
      />
    </div>
  );
}
