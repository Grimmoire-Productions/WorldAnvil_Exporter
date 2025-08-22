import ArticleProvider from "../../../context/ArticleContext";
import { UserContext } from "../../../context/UserContext";
import { WorldContext } from "../../../context/WorldContext";
import { ROUTE_PATHS } from "../../../routes";
import type {
  ArticleInitialValues,
  UserContextType,
  WorldContextType,
} from "../../../utils/types";
import React from "react";
import { Outlet, redirect } from "react-router";

export default function WorldsProtectedRoute() {
  const { user, isLoggedIn } = React.useContext(UserContext) as UserContextType;
  const { selectedWorld } = React.useContext(WorldContext) as WorldContextType;

  if (!user || !isLoggedIn) {
    return redirect(ROUTE_PATHS.login);
  }

  if (!selectedWorld) {
    return redirect(ROUTE_PATHS.worlds)
  }
  
  const articleInitialValues: ArticleInitialValues = {
    errorMessage: null,
    articleId: "",
    activeCharacter: "",
    isArticleLoading: false,
  };

  return (
      <ArticleProvider initialValues={articleInitialValues}>
        <Outlet />
      </ArticleProvider>
  );
}
