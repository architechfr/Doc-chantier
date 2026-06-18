import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase navigateur basé sur les COOKIES (@supabase/ssr).
 * À utiliser dans la page de connexion : la session est stockée en cookies,
 * ce qui permet au middleware (côté serveur) de la lire et de protéger l'app.
 */
export function supabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Supabase non configuré (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).");
  }
  return createBrowserClient(url, anon);
}
