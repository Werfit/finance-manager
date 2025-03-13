import { Sheet } from "@/libs/db/schema";

export type AnalyticsContextState = {
  sheetId: Sheet["id"];
};

export type AnalyticsProviderProps = {
  children: React.ReactNode | React.ReactNode[];
  sheetId: Sheet["id"];
};
