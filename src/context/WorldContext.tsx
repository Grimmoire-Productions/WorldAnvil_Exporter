import React, { createContext, useState } from 'react';
import type { WorldContextType, WorldInitialValues } from '../utils/types';

export const WorldContext = createContext<WorldContextType | null>(null);

const WorldProvider: React.FC<{
  initialValues: WorldInitialValues;
  children: React.ReactNode;
}> = ({ initialValues, children }) => {
  const [selectedWorld, setSelectedWorld] = useState(initialValues.selectedWorld);

  return (
    <WorldContext.Provider
      value={{
        selectedWorld,
        setSelectedWorld
      }}
    >
      {children}
    </WorldContext.Provider>
  );
};

export default WorldProvider;