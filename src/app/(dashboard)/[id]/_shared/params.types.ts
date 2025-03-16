import { Category, Sheet } from "@/libs/db/schema";

export type AnalyticsLayoutParams = {
  id: Sheet["id"];
  // category can be selected or not
  category?: Category["id"];
};
