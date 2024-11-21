// OverlayContext.js
import React, { createContext, useContext, useState } from "react";

// Create Context
const OverlayContext = createContext();

// Create a provider component
export const OverlayProvider = ({ children }) => {
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <OverlayContext.Provider value={{ showOverlay, setShowOverlay }}>
      {children}
    </OverlayContext.Provider>
  );
};

// Hook to use the context
export const useOverlay = () => useContext(OverlayContext);
