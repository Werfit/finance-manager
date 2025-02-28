"use client";

import { ImportIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Sheet } from "@/libs/db/schema";

import { ImportRecordsForm } from "./import-records-form.component";

type ImportRecordsButtonProps = {
  sheetId: Sheet["id"];
};

export const ImportRecordsButton: React.FC<ImportRecordsButtonProps> = ({
  sheetId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <ImportIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import existing records</DialogTitle>
          <DialogDescription>
            Import existing records from a CSV file
          </DialogDescription>
        </DialogHeader>

        <ImportRecordsForm
          onSubmit={() => setIsOpen(false)}
          sheetId={sheetId}
        />
      </DialogContent>
    </Dialog>
  );
};
