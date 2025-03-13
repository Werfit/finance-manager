import { DicesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  // DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { RecordsGeneratorForm } from "./records-generator-form.component";

// import { useAnalytics } from "../../_context/analytics-context.hooks";

export const RecordsGenerator = () => {
  // const { sheetId } = useAnalytics();
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <DicesIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Records Generator</DrawerTitle>
          <DrawerDescription>
            You can generate some random transaction records here. Narrow down
            transaction features below and click <b>Generate</b>.
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto px-4">
          <RecordsGeneratorForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
