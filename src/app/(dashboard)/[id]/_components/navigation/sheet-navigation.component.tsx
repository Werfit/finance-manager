import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

import { Navigation } from "@/app/(dashboard)/_components/navigation.component";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/libs/db/schema";

import { SheetTitle } from "./_components/sheet-title.component";
import { SheetToolbar } from "./_components/sheet-toolbar.component";

type SheetNavigationProps = {
  sheetId: Sheet["id"];
};

export const SheetNavigation: React.FC<SheetNavigationProps> = ({
  sheetId,
}) => (
  <Navigation
    title={
      <>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ChevronLeftIcon />
          </Link>
        </Button>
        <SheetTitle sheetId={sheetId} />
      </>
    }
    toolbar={<SheetToolbar sheetId={sheetId} />}
  />
);
