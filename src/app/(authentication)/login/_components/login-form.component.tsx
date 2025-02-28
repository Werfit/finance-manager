"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { login } from "@/app/actions/authentication.actions";
import { LoadingButton } from "@/components/loading-button.component";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast.hook";
import {
  LoginSchema,
  loginSchema,
} from "@/shared/schemas/authentication.schema";

import { PasswordInput } from "../../_components/password-input.component";

export const LoginForm = () => {
  const {
    formState: { isSubmitting, ...formState },
    ...form
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { toast } = useToast();

  return (
    <Form {...form} formState={{ ...formState, isSubmitting }}>
      <form
        className="flex flex-col gap-y-2"
        onSubmit={form.handleSubmit(async (data) => {
          const formData = new FormData();
          formData.set("email", data.email);
          formData.set("password", data.password);

          const response = await login(formData);

          toast({
            title: "Authentication Error",
            description: response.error,
            variant: "destructive",
          });
        })}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="finance@exprt.com"
                  className="bg-white"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} className="bg-white" />
              </FormControl>
            </FormItem>
          )}
        />

        <LoadingButton type="submit" className="mt-2" loading={isSubmitting}>
          Login
        </LoadingButton>
      </form>
    </Form>
  );
};
