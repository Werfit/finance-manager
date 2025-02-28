"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { NewRecordForm } from "./new-record-form.component";
import { useState } from "react";
import { Sheet } from "@/libs/db/schema";

type NewRecordButtonProps = {
  sheetId: Sheet["id"];
};

export const NewRecordButton: React.FC<NewRecordButtonProps> = ({
  sheetId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new record</DialogTitle>
          <DialogDescription>
            Add a new expense/income record to your account
          </DialogDescription>
        </DialogHeader>

        <NewRecordForm onSubmit={() => setIsOpen(false)} sheetId={sheetId} />
      </DialogContent>
    </Dialog>
  );
};
