"use client";

import { Navigation } from "@/app/(dashboard)/_components/navigation.component";

import { AnalyticsNavigationTitle } from "./analytics-navigation-title.component";
import { AnalyticsNavigationToolbar } from "./analytics-navigation-toolbar.component";

export const AnalyticsNavigation = () => (
  <Navigation
    title={<AnalyticsNavigationTitle />}
    toolbar={<AnalyticsNavigationToolbar />}
  />
);
