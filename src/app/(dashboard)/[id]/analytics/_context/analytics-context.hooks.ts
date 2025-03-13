import { useContext } from "react";

import { AnalyticsContext } from "./analytics.context";

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);

  if (!context) {
    throw new Error("Can't use `useAnalytics` outside its context.");
  }

  return context;
};
