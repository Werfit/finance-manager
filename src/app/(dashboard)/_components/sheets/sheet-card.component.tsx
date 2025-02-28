import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SheetWithRecordsAmount } from "@/libs/db/queries/sheets/sheet.types";
import { formatDate } from "@/shared/utils/date.util";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

type SheetCardProps = {
  sheet: SheetWithRecordsAmount;
};

export const SheetCard: React.FC<SheetCardProps> = ({ sheet }) => {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{sheet.name}</CardTitle>

        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${sheet.id}`}>
            <ChevronRightIcon />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <CardDescription className="flex flex-wrap items-center justify-between">
          <p>
            <b>Records</b>: {sheet.recordsAmount}
          </p>
          <p>{formatDate(sheet.createdAt)}</p>
        </CardDescription>
      </CardContent>
    </Card>
  );
};
