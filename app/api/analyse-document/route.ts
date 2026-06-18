import { NextResponse } from "next/server";
import { analyseDocumentImage, isOpenAIConfigured } from "@/lib/openai";
import type { AnalyseResult } from "@/types/document";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Réponse fictive renvoyée en mode démo (MISTRAL_API_KEY absent). */
function demoResult(filename?: string): AnalyseResult {
  return {
    document_detected: true,
    document_category: "URSSAF",
    document_name: "Attestation de vigilance URSSAF",
    issuer: "URSSAF (exemple — mode démo)",
    company_name: "Entreprise Exemple SARL",
    siret: "812 345 678 00021",
    issue_date: "2026-01-10",
    expiry_date: "2026-07-10",
    validity_status: "renewal_soon",
    confidence_score: 0.42,
    missing_documents: [],
    detected_requirements: [],
    alerts: [
      "Mode démo : MISTRAL_API_KEY non configuré, ce résultat est fictif.",
    ],
    online_check_required: true,
    summary: `Analyse simulée pour ${filename ?? "le document"}. Configurez MISTRAL_API_KEY pour une analyse réelle.`,
    recommended_action:
      "Renseigner MISTRAL_API_KEY dans .env.local pour activer l'analyse IA.",
  };
}

export async function POST(request: Request) {
  let body: { dataUrl?: string; filename?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const { dataUrl, filename } = body;
  if (!dataUrl) {
    return NextResponse.json(
      { error: "Champ 'dataUrl' manquant." },
      { status: 400 },
    );
  }

  // Mode démo : pas de clé OpenAI → on renvoie un résultat fictif exploitable.
  if (!isOpenAIConfigured()) {
    return NextResponse.json({ result: demoResult(filename), demo: true });
  }

  // Les PDF ne sont pas acceptés par l'endpoint vision (images uniquement en MVP).
  if (dataUrl.startsWith("data:application/pdf")) {
    return NextResponse.json(
      {
        error:
          "PDF non pris en charge par l'analyse vision en V1. Importez une photo (JPEG/PNG) ou convertissez le PDF en image.",
      },
      { status: 415 },
    );
  }

  try {
    const result = await analyseDocumentImage(dataUrl);
    return NextResponse.json({ result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Échec de l'analyse IA.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
