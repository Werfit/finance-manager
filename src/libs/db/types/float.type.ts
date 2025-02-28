import { customType } from "drizzle-orm/pg-core";

export const float = customType<{ data: number; driverData: string }>({
  dataType() {
    return "numeric";
  },
  toDriver(value) {
    return value.toString();
  },
  fromDriver(value) {
    return parseFloat(value);
  },
});
