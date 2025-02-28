import { Button } from "@/components/ui/button";

import { ChevronLeftIcon } from "lucide-react";
import { Sheet } from "@/libs/db/schema";

import { SheetTitle } from "./_components/sheet-title.component";
import { Navigation } from "@/app/(dashboard)/_components/navigation.component";
import { SheetToolbar } from "./_components/sheet-toolbar.component";
import Link from "next/link";

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
