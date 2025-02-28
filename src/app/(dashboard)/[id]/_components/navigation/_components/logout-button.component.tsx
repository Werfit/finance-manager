"use client";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";

import { logout } from "@/app/actions/authentication.actions";
import { Button } from "@/components/ui/button";

export const LogoutButton = () => {
  const { pending } = useFormStatus();

  return (
    <form action={logout}>
      <Button type="submit" variant="ghost" size="icon" disabled={pending}>
        <LogOut />
      </Button>
    </form>
  );
};
