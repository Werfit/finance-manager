import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

import { Navigation } from "@/app/(dashboard)/_components/navigation.component";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/libs/db/schema";

import { SheetTitle } from "../../_components/navigation/_components/sheet-title.component";

type StatisticsNavigationProps = {
  sheetId: Sheet["id"];
};

export const StatisticsNavigation: React.FC<StatisticsNavigationProps> = ({
  sheetId,
}) => {
  return (
    <Navigation
      title={
        <>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/${sheetId}`}>
              <ChevronLeftIcon />
            </Link>
          </Button>
          <SheetTitle sheetId={sheetId} />
        </>
      }
    />
  );
};
