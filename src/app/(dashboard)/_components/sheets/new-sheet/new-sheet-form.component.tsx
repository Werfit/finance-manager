import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { LoadingButton } from "@/components/loading-button.component";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateSheetMutation } from "@/libs/query/queries/sheets.queries";
import {
  CreateSheetSchema,
  createSheetSchema,
} from "@/shared/schemas/sheet.schema";

type NewSheetFormProps = {
  onSubmit?: () => void;
};

export const NewSheetForm: React.FC<NewSheetFormProps> = ({ onSubmit }) => {
  const form = useForm<CreateSheetSchema>({
    resolver: zodResolver(createSheetSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate: createSheet, isPending } = useCreateSheetMutation(onSubmit);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(() => {
          createSheet(form.getValues());
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton type="submit" loading={isPending}>
          Create
        </LoadingButton>
      </form>
    </Form>
  );
};
