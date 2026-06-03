import { NextResponse } from "next/server";
import { getDocuments } from "@/lib/data";

export const runtime = "nodejs";

/**
 * GET /api/documents?entrepriseId=...&chantierId=...
 * Renvoie les documents (au format ligne de tableau de bord).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entrepriseId = searchParams.get("entrepriseId") ?? undefined;
  const chantierId = searchParams.get("chantierId") ?? undefined;

  try {
    const documents = await getDocuments({ entrepriseId, chantierId });
    return NextResponse.json({ documents });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Erreur de lecture des documents.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
