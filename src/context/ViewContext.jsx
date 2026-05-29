import React, { createContext, useContext, useState } from 'react';

const ViewContext = createContext();

export function ViewProvider({ children }) {
  // Global flag: true = Everyday Ambient HUD, false = Developer Canvas
  const [isAmbientMode, setIsAmbientMode] = useState(true);

  return (
    <ViewContext.Provider value={{ isAmbientMode, setIsAmbientMode }}>
      {children}
    </ViewContext.Provider>
  );
}

export const useViewMode = () => useContext(ViewContext);