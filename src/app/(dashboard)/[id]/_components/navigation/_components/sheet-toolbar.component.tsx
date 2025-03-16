import { ChartAreaIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet } from "@/libs/db/schema";

import { ImportRecordsButton } from "./import-records-button/import-records-button.component";
import { NewRecordButton } from "./new-record-button/new-record-button.component";

type SheetToolbarProps = {
  sheetId: Sheet["id"];
};

export const SheetToolbar: React.FC<SheetToolbarProps> = ({ sheetId }) => (
  <>
    <Button variant="outline" size="icon" asChild>
      <Link href={`/${sheetId}/analytics`}>
        <ChartAreaIcon />
      </Link>
    </Button>
    <ImportRecordsButton sheetId={sheetId} />
    <NewRecordButton sheetId={sheetId} />
  </>
);
