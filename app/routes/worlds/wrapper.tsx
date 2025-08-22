import { UserContext } from "../../context/UserContext";
import WorldProvider from "../../context/WorldContext";
import { ROUTE_PATHS } from "../../routes";
import type { UserContextType, WorldInitialValues } from "../../utils/types";
import React from "react";
import { Outlet, redirect } from "react-router";

export default function WorldsProtectedRoute() {

  const { user, isLoggedIn } = React.useContext(UserContext) as UserContextType;

  if (!user || !isLoggedIn) {
    return redirect(ROUTE_PATHS.login)
  }

  const worldInitialValues: WorldInitialValues = {
    worldIsLoading: false,
    selectedWorld: null,
    selectedTags: [],
    selectedRunTag: null,
  };

  return (
      <WorldProvider initialValues={worldInitialValues}>
        <Outlet/>
    </WorldProvider>
  );
}
