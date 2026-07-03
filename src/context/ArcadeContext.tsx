"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface ArcadeContextType {
  open: boolean;
  openArcade: () => void;
  closeArcade: () => void;
}

const ArcadeContext = createContext<ArcadeContextType | undefined>(undefined);

export function ArcadeProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openArcade = useCallback(() => setOpen(true), []);
  const closeArcade = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openArcade, closeArcade }),
    [open, openArcade, closeArcade]
  );

  return <ArcadeContext.Provider value={value}>{children}</ArcadeContext.Provider>;
}

export function useArcade() {
  const context = useContext(ArcadeContext);
  if (context === undefined) {
    throw new Error("useArcade must be used within an ArcadeProvider");
  }
  return context;
}
