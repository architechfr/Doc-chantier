import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client navigateur (clé anon). À utiliser côté Client Components.
 * Renvoie null si la config est absente, pour permettre un démarrage en mode démo.
 */
export function createBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: { persistSession: true },
  });
}

/**
 * Client serveur (clé service_role). À n'utiliser QUE dans les route handlers
 * et server actions — jamais exposé au navigateur.
 */
export function createServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase non configuré : définir NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export const STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET ?? "documents";
