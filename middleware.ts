import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Barrière d'accès DocChantier.
 * Réservé aux e-mails autorisés (Houda + admin). Toute autre personne — même
 * connectée — est renvoyée vers /login. La vérification est faite CÔTÉ SERVEUR,
 * avant tout affichage de données.
 *
 * Les e-mails autorisés sont configurables via la variable d'env
 * DOC_ALLOWED_EMAILS (séparés par des virgules). Valeur par défaut ci-dessous.
 */
const ALLOWED_EMAILS = (
  process.env.DOC_ALLOWED_EMAILS ??
  "h.wahsh@cadence-architectes.fr,archi.tech.fr@gmail.com"
)
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Toujours laisser passer la page de connexion et la route d'API d'auth.
  if (pathname.startsWith("/login")) return NextResponse.next();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Si Supabase n'est pas configuré (mode démo), on ne bloque pas.
  if (!url || !anon) return NextResponse.next();

  let res = NextResponse.next({ request: req });

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => {
          req.cookies.set(name, value);
        });

        res = NextResponse.next({ request: req });

        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";

  // Non connecté → page de connexion.
  if (!user) {
    return NextResponse.redirect(loginUrl);
  }

  // Connecté mais e-mail non autorisé → refus.
  const email = (user.email ?? "").toLowerCase();

  if (!ALLOWED_EMAILS.includes(email)) {
    loginUrl.searchParams.set("denied", "1");
    return NextResponse.redirect(loginUrl);
  }

  // Autorisé → on continue en conservant les cookies de session rafraîchis.
  return res;
}

export const config = {
  // S'applique à toutes les routes SAUF les fichiers statiques et les images.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};