import React from "react";
import { redirect } from "react-router";
import { UserContext } from "~/context/UserContext";
import type { UserContextType } from "~/utils/types";
import {ROUTE_PATHS} from "~/routes"

export default function HomePage() {
  const { isLoggedIn } = React.useContext(UserContext) as UserContextType;

  if (isLoggedIn) {
    return redirect(ROUTE_PATHS.worlds)
  }

  return (
    <div>
      <h1>World Anvil Tool</h1>
      <button> <a href={ROUTE_PATHS.login}>Sign In</a></button>
    </div>
  );
}
