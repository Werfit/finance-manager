import { MinusIcon } from "lucide-react";
import { useId, useState } from "react";

import { MinMaxInput } from "@/components/min-max-input.component";
import { SimpleTooltip } from "@/components/simple-tooltip.component";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Category } from "@/libs/db/schema";
import { GenerateRandomTransactionsSchema } from "@/shared/schemas/record.schema";

type CategoryInputProps = {
  category: Category;
};

type CategoryState =
  GenerateRandomTransactionsSchema["categories"][number]["range"];

export const CategoryInput: React.FC<CategoryInputProps> = ({ category }) => {
  const [amount, setAmount] = useState<CategoryState>({
    min: -10_000,
    max: 10_000,
  });
  const [frequency, setFrequency] = useState<CategoryState>({
    min: 0,
    max: 60,
  });
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      <Accordion type="single" collapsible>
        <AccordionItem value={id}>
          <div className="flex items-center justify-between gap-1 py-0">
            <AccordionTrigger
              headerClassName="flex-1 py-0 overflow-hidden"
              className="text-muted-foreground inline cursor-pointer overflow-hidden py-0 text-sm font-bold text-nowrap text-ellipsis capitalize"
            >
              <SimpleTooltip content={category.name}>
                <span>{category.name}</span>
              </SimpleTooltip>
            </AccordionTrigger>

            <Button type="button" variant="ghost" size="icon">
              <MinusIcon />
            </Button>
          </div>

          <AccordionContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Label className="font-semibold">Amount Range</Label>
              <p className="text-muted-foreground text-xs">
                Min and max amount you want the range transaction amount to be.
              </p>

              <MinMaxInput value={amount} onChange={setAmount} />
            </div>

            <div className="flex flex-wrap gap-2">
              <Label className="font-semibold">Frequency Range</Label>
              <p className="text-muted-foreground text-xs">
                How often a transaction can occur within a month.
              </p>

              <MinMaxInput value={frequency} onChange={setFrequency} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
