export const CategoryTypes = ["income", "expense"] as const;

export const CategoryType = {
  INCOME: "income",
  EXPENSE: "expense",
} as const satisfies Record<string, (typeof CategoryTypes)[number]>;
