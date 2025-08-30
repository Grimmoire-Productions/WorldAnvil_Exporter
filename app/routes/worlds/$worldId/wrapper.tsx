import ArticleProvider from "../../../context/ArticleContext";
import { UserContext } from "../../../context/UserContext";
import { WorldContext } from "../../../context/WorldContext";
import { ROUTE_PATHS } from "../../../routes";
import type {
  ArticleInitialValues,
  UserContextType,
  WorldContextType,
} from "../../../utils/types";
import React, { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router";

export default function WorldProtectedRoute() {
  const { user, isLoggedIn, isAutoLoginPending, isAutoLoginInProgress } = React.useContext(UserContext) as UserContextType;
  const { selectedWorld, setSelectedWorld } = React.useContext(WorldContext) as WorldContextType;
  const { worldId } = useParams<{ worldId: string }>();
  const navigate = useNavigate();

  // Try to set selectedWorld from URL if we have user data (backup to MainHeader logic)
  useEffect(() => {
    if (worldId && user?.worlds && !selectedWorld) {
      const world = user.worlds.find(w => w.id === worldId);
      if (world) {
        setSelectedWorld(world);
      }
    }
  }, [worldId, user?.worlds, selectedWorld, setSelectedWorld]);

  useEffect(() => {
    // Don't redirect while auto-login is pending or in progress
    if (isAutoLoginPending || isAutoLoginInProgress) {
      return;
    }
    
    // Redirect to login if not logged in
    if (!isLoggedIn || !user) {
      navigate(ROUTE_PATHS.login);
      return;
    }
    
    // Only redirect to /worlds if user is loaded AND world truly doesn't exist
    if (user && !selectedWorld) {
      // Give it a moment for MainHeader or our backup logic to set selectedWorld
      const timer = setTimeout(() => {
        if (!selectedWorld) {
          navigate(ROUTE_PATHS.worlds);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAutoLoginPending, isAutoLoginInProgress, isLoggedIn, user, selectedWorld, navigate, worldId]);

  // Show loading while auto-login pending/in progress or if redirecting
  if (isAutoLoginPending || isAutoLoginInProgress || !user || !isLoggedIn || !selectedWorld) {
    return <div>Loading...</div>;
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
