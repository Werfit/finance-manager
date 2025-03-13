"use client";

import { createContext } from "react";

import {
  AnalyticsContextState,
  AnalyticsProviderProps,
} from "./analytics-context.types";

export const AnalyticsContext = createContext<AnalyticsContextState | null>(
  null
);

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  sheetId,
}) => {
  return (
    <AnalyticsContext.Provider value={{ sheetId }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
