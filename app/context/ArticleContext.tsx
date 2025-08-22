import React, { createContext, useState, useCallback } from 'react';

import backendAPI from "../utils/backendAPI";
import { ProcessArticle } from "../utils/processArticle"

import type {
  ArticleResponse,
  ArticleContextType,
  ArticleInitialValues,
} from '../utils/types'

export const ArticleContext = createContext<ArticleContextType | null>(null);

const ArticleProvider: React.FC<{
  initialValues: ArticleInitialValues;
  children: React.ReactNode;
}> = ({ initialValues, children }) => {

  const [activeCharacter, setActiveCharacter] = useState(initialValues.activeCharacter);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    initialValues.errorMessage
  );
  const [articleId, setArticleId] = useState(initialValues.articleId);
  const [isArticleLoading, setIsArticleLoading] = useState(initialValues.isArticleLoading)

  const fetchAndProcessCharacter = useCallback(async (
    articleId: string,
    selectedWorldKey: string,
  ) => {
    setIsArticleLoading(true);
    setErrorMessage(null);
    
    try {
      const results: ArticleResponse = await backendAPI.fetchCharacter(articleId);

      if (results?.id) {
        const processedCharacter = await ProcessArticle(results, selectedWorldKey);
        setActiveCharacter(processedCharacter);
      } else {
        setErrorMessage(`Character not found. Please try again.`);
        setActiveCharacter('');
      }
    } catch (error) {
      setErrorMessage(`Failed to load character. Please try again.`);
      setActiveCharacter('');
    } finally {
      setIsArticleLoading(false);
    }
  }, []);
  
  return (
    <ArticleContext.Provider
      value={{
        articleId,
        setArticleId,
        activeCharacter,
        setActiveCharacter,
        errorMessage,
        setErrorMessage,
        isArticleLoading,
        setIsArticleLoading,
        fetchAndProcessCharacter
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export default ArticleProvider;