import { createBrowserClient } from "@supabase/ssr";

import { clientEnvironment } from "@/shared/environment/client.environment";

export function createClient() {
  return createBrowserClient(
    clientEnvironment.NEXT_PUBLIC_SUPABASE_URL,
    clientEnvironment.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
