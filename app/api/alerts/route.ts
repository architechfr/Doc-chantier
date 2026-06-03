import { NextResponse } from "next/server";
import { planAlerts } from "@/lib/alerts";

export const runtime = "nodejs";

/**
 * POST /api/alerts
 * Body: { code, issueDate, expiryDate }
 * Renvoie les jalons d'alerte (J-30, J-15, J-7) à planifier pour un document.
 *
 * En V1 ce endpoint calcule les dates ; l'envoi effectif (email) et la
 * persistance dans la table `alerts` relèvent de la Phase 5.
 */
export async function POST(request: Request) {
  let body: {
    code?: string | null;
    issueDate?: string | null;
    expiryDate?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const alerts = planAlerts({
    code: body.code ?? null,
    issueDate: body.issueDate ?? null,
    expiryDate: body.expiryDate ?? null,
  });

  return NextResponse.json({ alerts });
}
