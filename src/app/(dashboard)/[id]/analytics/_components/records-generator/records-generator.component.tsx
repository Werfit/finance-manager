"use client";

import { DicesIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { AnalyticsLayoutParams } from "../../../_shared/params.types";
import { RecordsGeneratorForm } from "./records-generator-form.component";

export const RecordsGenerator = () => {
  const [open, setOpen] = useState(false);
  const { id: sheetId } = useParams<AnalyticsLayoutParams>();

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
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
          <RecordsGeneratorForm
            sheetId={sheetId}
            onSubmit={() => setOpen(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
