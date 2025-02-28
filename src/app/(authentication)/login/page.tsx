import Link from "next/link";

import { LoginForm } from "./_components/login-form.component";

const Page = () => {
  return (
    <main className="flex flex-col gap-y-2">
      <LoginForm />

      <footer className="flex flex-wrap items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Do not have an account?{" "}
          <Link className="underline underline-offset-2" href="/sign-up">
            Sign Up
          </Link>
        </span>

        <Link
          className="text-xs text-muted-foreground underline underline-offset-2"
          href="/forgot-password"
        >
          Forgot password?
        </Link>
      </footer>
    </main>
  );
};

export default Page;
