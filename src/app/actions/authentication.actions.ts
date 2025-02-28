"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/libs/supabase/server";
import {
  loginSchema,
  signUpSchema,
} from "@/shared/schemas/authentication.schema";
import { SupabaseErrorCode } from "@/libs/supabase/error-code.constants";
import { createDefaultSheet } from "./sheets.actions";

export const login = async (formData: FormData) => {
  const supabase = await createClient();

  const { success, data } = await loginSchema.safeParseAsync({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!success) {
    return { error: "Invalid credentials" };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword(data);

  if (signInError) {
    if (signInError.code === SupabaseErrorCode.INVALID_CREDENTIALS) {
      return { error: "Invalid credentials" };
    }

    return { error: "Something went wrong" };
  }

  revalidatePath("/", "layout");
  redirect("/");
};

export const signup = async (formData: FormData) => {
  const supabase = await createClient();

  const { success, data } = await signUpSchema.safeParseAsync({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    passwordConfirmation: formData.get("passwordConfirmation") as string,
  });

  if (!success) {
    return { error: "Invalid credentials" };
  }

  const { error: signUpError, data: signUpData } =
    await supabase.auth.signUp(data);

  if (signUpError) {
    return { error: signUpError.message };
  }

  if (signUpData.user) {
    await createDefaultSheet(signUpData.user.id);
  }

  revalidatePath("/", "layout");
  redirect("/");
};

export const logout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
};
