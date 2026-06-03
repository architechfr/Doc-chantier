import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Endpoint OCR réservé (Phase 3).
 *
 * En V1, l'extraction est réalisée directement par le modèle vision dans
 * /api/analyse-document (OCR + structuration en une passe). Ce endpoint est
 * conservé comme point d'extension pour un OCR dédié (Tesseract, Textract…)
 * si l'on souhaite découpler reconnaissance de texte et analyse sémantique.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "OCR dédié non implémenté en V1. L'analyse passe par /api/analyse-document (vision).",
    },
    { status: 501 },
  );
}
