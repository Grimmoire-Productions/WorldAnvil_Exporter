import React, { createContext, useState } from 'react';

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

  const fetchAndProcessCharacter = async (
    articleId: string,
    selectedWorldKey: string,
  ) => {
    setIsArticleLoading(true);
    const results: ArticleResponse = await backendAPI.fetchCharacter(articleId)

    if (results?.id) {
      setActiveCharacter(await ProcessArticle(results, selectedWorldKey));
    }

    if (!activeCharacter) {
      setErrorMessage(`Something went wrong. Please try again.`);
    } else {
      setErrorMessage(null);
    }
    setIsArticleLoading(false);
    return;
  };
  
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