import Link from "next/link";

import { SignUpForm } from "./_components/sign-up-form.component";

const Page = () => {
  return (
    <main className="flex flex-col gap-y-2">
      <SignUpForm />

      <footer className="flex flex-wrap items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Have an account already?{" "}
          <Link className="underline underline-offset-2" href="/login">
            Log in
          </Link>
        </span>
      </footer>
    </main>
  );
};

export default Page;
