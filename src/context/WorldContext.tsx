import React, { createContext, useState } from 'react';
import type { WorldContextType, WorldInitialValues } from '../utils/types';

export const WorldContext = createContext<WorldContextType | null>(null);

const WorldProvider: React.FC<{
  initialValues: WorldInitialValues;
  children: React.ReactNode;
}> = ({ initialValues, children }) => {
  const [worldIsLoading, setWorldIsLoading] = useState(initialValues.worldIsLoading);
  const [selectedWorld, setSelectedWorld] = useState(initialValues.selectedWorld);
  const [selectedTags, setSelectedTags] = useState(initialValues.selectedTags)

  return (
    <WorldContext.Provider
      value={{
        worldIsLoading,
        setWorldIsLoading,
        selectedWorld,
        setSelectedWorld,
        selectedTags,
        setSelectedTags,
      }}
    >
      {children}
    </WorldContext.Provider>
  );
};

export default WorldProvider;