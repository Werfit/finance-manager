import { useQuery } from "@tanstack/react-query";

import { Typeahead } from "@/components/typeahead.component";
import { getCategoriesOptions } from "@/libs/query/queries/categories.queries";

type CategoryInputProps = Omit<
  React.ComponentProps<typeof Typeahead>,
  "options" | "disabled" | "placeholder"
>;

export const CategoryInput: React.FC<CategoryInputProps> = ({ ...props }) => {
  const { data, isLoading, isError } = useQuery(getCategoriesOptions());

  const categories = isLoading || isError ? [] : data?.categories || [];

  return (
    <Typeahead
      options={(categories || []).map((category) => ({
        label: category.name,
        value: category.id,
      }))}
      placeholder="Select a category"
      disabled={isLoading || isError}
      {...props}
    />
  );
};
