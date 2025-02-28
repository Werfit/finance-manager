"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { NewSheetForm } from "./new-sheet-form.component";

export const NewSheetButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-full">
          <PlusIcon className="text-muted-foreground !size-8" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Sheet</DialogTitle>
          <DialogDescription>
            Create a new sheet to start tracking your expenses.
          </DialogDescription>
        </DialogHeader>
        <NewSheetForm onSubmit={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
