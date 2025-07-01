import React, { createContext, useState } from 'react';

import worldAnvilAPI from "../utils/worldAnvilAPI";
import { ProcessArticle } from "../utils/processArticle"

import type {
  ArticleResponse,
  ArticleContextType,
  ArticleInitialValues,
  UserContextType
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

  const fetchCharacter = async (
    userToken: UserContextType['accessToken'],
    articleId: string
  ) => {
    const results: ArticleResponse = await worldAnvilAPI.fetchCharacter(userToken, articleId)

    if (results?.id) {
      setActiveCharacter(await ProcessArticle(userToken, results));
    }

    if (!activeCharacter) {
      setErrorMessage(`Something went wrong. Please try again.`);
    } else {
      setErrorMessage(null);
    }
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
        fetchCharacter
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export default ArticleProvider;