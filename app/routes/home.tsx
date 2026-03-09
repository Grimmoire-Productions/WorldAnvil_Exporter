import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "~/context/UserContext";
import type { UserContextType } from "~/utils/types";
import { ROUTE_PATHS } from "~/routes";

export default function HomePage() {
  const { isLoggedIn } = React.useContext(UserContext) as UserContextType;
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(ROUTE_PATHS.worlds);
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
      <h1>World Anvil Tool</h1>
      <button>
        {" "}
        <a href={ROUTE_PATHS.login}>Sign In</a>
      </button>
    </div>
  );
}
