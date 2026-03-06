import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "~/context/UserContext";
import type { UserContextType } from "~/utils/types";
import {ROUTE_PATHS} from "~/routes"

export default function HomePage() {
  const { isLoggedIn } = React.useContext(UserContext) as UserContextType;
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(ROUTE_PATHS.worlds);
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
            World Anvil Tool
          </h1>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a href={ROUTE_PATHS.login} className="blueButton">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
