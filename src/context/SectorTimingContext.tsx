"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { SectorStatus } from "@/hooks/useSectorTiming";

export interface SectorData {
  id: string;
  label: string; // "S1", "S2", etc.
  title: string;
  dwellMs: number;
  targetMs: number;
  status: SectorStatus;
}

interface SectorTimingContextType {
  sectors: Record<string, SectorData>;
  registerSector: (id: string, label: string, title: string, targetSeconds: number) => void;
  updateSectorTime: (id: string, dwellMs: number, status: SectorStatus) => void;
}

const SectorTimingContext = createContext<SectorTimingContextType | undefined>(undefined);

export function SectorTimingProvider({ children }: { children: React.ReactNode }) {
  const [sectors, setSectors] = useState<Record<string, SectorData>>({});

  const registerSector = useCallback((id: string, label: string, title: string, targetSeconds: number) => {
    setSectors((prev) => {
      if (prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          id,
          label,
          title,
          dwellMs: 0,
          targetMs: targetSeconds * 1000,
          status: "pending",
        },
      };
    });
  }, []);

  const updateSectorTime = useCallback((id: string, dwellMs: number, status: SectorStatus) => {
    setSectors((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      if (existing.dwellMs === dwellMs && existing.status === status) return prev;
      return {
        ...prev,
        [id]: {
          ...existing,
          dwellMs,
          status,
        },
      };
    });
  }, []);

  return (
    <SectorTimingContext.Provider value={{ sectors, registerSector, updateSectorTime }}>
      {children}
    </SectorTimingContext.Provider>
  );
}

export function useSectorTimingContext() {
  const context = useContext(SectorTimingContext);
  if (!context) {
    throw new Error("useSectorTimingContext must be used within a SectorTimingProvider");
  }
  return context;
}
