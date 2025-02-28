"use client";

import { logout } from "@/app/actions/authentication.actions";
import { Button } from "@/components/ui/button";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";

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
