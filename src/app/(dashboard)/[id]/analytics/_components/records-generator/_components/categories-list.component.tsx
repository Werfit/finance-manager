"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Control, FieldArrayPath, useFieldArray } from "react-hook-form";

import { CategoryType } from "@/libs/db/shared/enums";
import { getCategoriesOptions } from "@/libs/query/queries/categories.queries";
import { GenerateRandomTransactionsSchema } from "@/shared/schemas/record.schema";

import { CategoryInput } from "./category-input.component";

type CategoriesListProps = {
  control: Control<GenerateRandomTransactionsSchema>;
  name: FieldArrayPath<GenerateRandomTransactionsSchema>;
};

export const CategoriesList: React.FC<CategoriesListProps> = ({
  control,
  name,
}) => {
  const { data, isPending, isError } = useQuery(getCategoriesOptions());
  const { fields, replace } = useFieldArray({ control, name });

  useEffect(() => {
    if (!data) {
      return;
    }

    replace(
      data.categories.map((category) => ({
        categoryId: category.id,
        range: {
          min: 0,
          max: 100_000,
        },
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (data) {
    console.log(data, fields);
  }

  if (isError) {
    return (
      <p className="bold text-muted-foreground text-center">
        Failed to fetch categories
      </p>
    );
  }

  if (isPending) {
    return <p className="bold text-muted-foreground text-center">Loading...</p>;
  }

  if (!data) {
    return (
      <p className="bold text-muted-foreground text-center">
        Failed to fetch categories
      </p>
    );
  }

  return (
    <>
      <div>
        <h6 className="text-xs font-bold">Income Categories</h6>

        <div className="flex flex-col *:border-b-2 *:py-2 *:last:border-none *:last:pb-0">
          {fields.map((field, index) => {
            const category = data.categories[index];

            if (category.id !== field.categoryId) {
              console.error(
                "Field id doesn't correspond the category id by its index. That was not supposed to happen"
              );
              return null;
            }

            if (category.type !== CategoryType.INCOME) {
              return null;
            }

            return <CategoryInput key={field.id} category={category} />;
          })}
        </div>
      </div>

      <div>
        <h6 className="text-xs font-bold">Expense Categories</h6>

        <div className="flex flex-col *:border-b-2 *:py-2 *:last:border-none *:last:pb-0">
          {fields.map((field, index) => {
            const category = data.categories[index];

            if (category.id !== field.categoryId) {
              console.error(
                "Field id doesn't correspond the category id by its index. That was not supposed to happen"
              );
              return null;
            }

            if (category.type !== CategoryType.EXPENSE) {
              return null;
            }

            return <CategoryInput key={field.id} category={category} />;
          })}
        </div>
      </div>
    </>
  );
};
