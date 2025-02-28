import { User } from "@supabase/supabase-js";
import { createClient } from "../server";
import { redirect } from "next/navigation";

export const getServerUser = async (): Promise<User> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return user;
};
