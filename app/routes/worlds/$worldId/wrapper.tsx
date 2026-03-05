import ArticleProvider from "~/context/ArticleContext/ArticleProvider";
import { UserContext } from "~/context/UserContext/UserContext";
import { WorldContext } from "~/context/WorldContext/WorldContext";
import { ROUTE_PATHS } from "~/routes";
import type {
  ArticleInitialValues,
  UserContextType,
  WorldContextType,
} from "~/utils/types";
import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import backendAPI from "~/utils/backendAPI";
import LoadingAnimation from "~/components/LoadingAnimation/LoadingAnimation";
import { useWorldFromUrl } from "~/hooks/useWorldFromUrl";

export default function WorldProtectedRoute() {
  const { user, isLoggedIn, isAutoLoginPending, isAutoLoginInProgress } = React.useContext(UserContext) as UserContextType;
  const { selectedWorld, setSelectedWorld, worldIsLoading, setWorldIsLoading } = React.useContext(WorldContext) as WorldContextType;
  const { worldId } = useParams<{ worldId: string }>();
  const navigate = useNavigate();
  const loadingWorldRef = useRef<string>('');

  // Derive world from URL - MainHeader will sync to context
  const worldFromUrl = useWorldFromUrl(worldId, user?.worlds);

  // Sync context only when URL-derived world differs from context
  useEffect(() => {
    if (worldFromUrl?.id !== selectedWorld?.id) {
      setSelectedWorld(worldFromUrl);
    }
  }, [worldFromUrl, selectedWorld?.id, setSelectedWorld]);

  // Load character sheets and tags if not already loaded
  useEffect(() => {
    if (!worldId || !selectedWorld) return;

    // Prevent concurrent loading of the same world
    if (loadingWorldRef.current === worldId) return;

    // Check if we need to load character sheets
    if (!selectedWorld.characterSheets || !selectedWorld.tags) {
      loadingWorldRef.current = worldId;
      setWorldIsLoading(true);

      const loadCharacterSheets = async () => {
        try {
          const results = await backendAPI.getCharacterSheets(selectedWorld.id);
          if (results.length > 0) {
            const tagSet = new Set(results.map((sheet) => sheet.tags).flat());

            // Update world with character sheets and tags
            setSelectedWorld({
              ...selectedWorld,
              characterSheets: results,
              tags: [...tagSet]
            });
          }
        } catch (error) {
          console.error("Failed to load world data:", error);
        } finally {
          setWorldIsLoading(false);
          loadingWorldRef.current = "";
        }
      };

      loadCharacterSheets();
    }
  }, [worldId, selectedWorld, setWorldIsLoading, setSelectedWorld]);

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
  if (isAutoLoginPending || isAutoLoginInProgress || !user || !isLoggedIn || !selectedWorld || worldIsLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <LoadingAnimation />
        <p style={{ marginTop: '1rem', color: '#666' }}>Loading world data...</p>
      </div>
    );
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
