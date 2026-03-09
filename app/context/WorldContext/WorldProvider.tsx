import React, { useState } from "react";
import { WorldContext } from "./WorldContext";
import type { WorldInitialValues } from "~/utils/types";

const WorldProvider: React.FC<{
  initialValues: WorldInitialValues;
  children: React.ReactNode;
}> = ({ initialValues, children }) => {
  const [worldIsLoading, setWorldIsLoading] = useState(
    initialValues.worldIsLoading,
  );
  const [selectedWorld, setSelectedWorld] = useState(
    initialValues.selectedWorld,
  );

  return (
    <WorldContext.Provider
      value={{
        worldIsLoading,
        setWorldIsLoading,
        selectedWorld,
        setSelectedWorld,
      }}
    >
      {children}
    </WorldContext.Provider>
  );
};

export default WorldProvider;
