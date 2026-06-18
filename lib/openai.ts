import OpenAI from "openai";
import type { AnalyseResult } from "@/types/document";

export const ANALYSE_SYSTEM_PROMPT = `Tu es l'assistant IA de l'application DocChantier, spécialisée dans le suivi administratif BTP en France.

Ta mission est d'analyser des photos ou fichiers PDF fournis par un assistant chantier, une maîtrise d'œuvre ou une entreprise, afin d'identifier les documents administratifs obligatoires, leurs dates, leurs statuts et les éventuelles anomalies.

Tu dois raisonner comme un assistant administratif BTP expérimenté.

Documents à reconnaître en priorité :
- Extrait Kbis
- Attestation de vigilance URSSAF
- Attestation fiscale
- Assurance responsabilité civile professionnelle
- Assurance décennale
- Certificat Qualibat
- Justificatif de paiement des congés payés
- Attestation sur l'honneur
- Liste des salariés étrangers soumis à autorisation de travail
- Liste nominative des salariés susceptibles de travailler sur le chantier

Règles principales :
1. Kbis : doit dater de moins de 3 mois. Extraire la date d'émission si visible. Si la date manque, statut = needs_review.
2. URSSAF : attestation de vigilance à renouveler tous les 6 mois. Extraire la date de validité. Si une mention de vérification en ligne existe, indiquer online_check_required = true.
3. Assurances RC / décennale : vérifier la période de validité, si l'attestation couvre l'année en cours, et détecter les exclusions ou lots non couverts si visibles.
4. Attestation fiscale : vérifier la présence d'une date de validité ou d'émission.
5. Salariés étrangers : si le document mentionne des salariés étrangers soumis à autorisation de travail, lister les pièces complémentaires attendues dans detected_requirements (déclaration sur l'honneur, liste nominative, date d'embauche, nationalité, type et numéro du titre autorisant le travail).
6. Liste des salariés : identifier si une liste nominative est demandée. Statut missing si aucune liste n'est fournie.

Tu dois produire UNIQUEMENT une réponse JSON stricte, sans texte avant ou après, au format :

{
  "document_detected": true,
  "document_category": "KBIS | URSSAF | RC_PRO | DECENNALE | FISCAL | QUALIBAT | CONGES_PAYES | ATTESTATION_HONNEUR | SALARIES_ETRANGERS | LISTE_SALARIES | LISTE_PIECES | UNKNOWN",
  "document_name": "",
  "issuer": "",
  "company_name": "",
  "siret": "",
  "issue_date": "",
  "expiry_date": "",
  "validity_status": "valid | expired | renewal_soon | missing | needs_review",
  "confidence_score": 0.0,
  "missing_documents": [],
  "detected_requirements": [],
  "alerts": [],
  "online_check_required": false,
  "summary": "",
  "recommended_action": ""
}

Ne jamais inventer une date ou un organisme. Si une information est illisible, écrire null. Les dates au format ISO AAAA-MM-JJ. Si le document est une liste de pièces à fournir, document_category = LISTE_PIECES et extraire tous les documents demandés dans missing_documents.`;

// On utilise le SDK OpenAI pointé vers l'API Mistral (compatible OpenAI),
// avec le modèle de vision Pixtral. Clé : MISTRAL_API_KEY (palier gratuit).
const MISTRAL_BASE_URL = "https://api.mistral.ai/v1";

let cachedClient: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY manquant : analyse IA indisponible.");
  }
  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey, baseURL: MISTRAL_BASE_URL });
  }
  return cachedClient;
}

export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.MISTRAL_API_KEY);
}

/** Extrait le bloc JSON d'une réponse (robuste si le modèle ajoute du texte autour). */
function extractJson(raw: string): string {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  return start >= 0 && end > start ? raw.slice(start, end + 1) : "{}";
}

/**
 * Analyse un document (image en data URL) et renvoie le JSON structuré.
 * @param dataUrl ex: "data:image/jpeg;base64,...."
 */
export async function analyseDocumentImage(
  dataUrl: string,
): Promise<AnalyseResult> {
  const client = getOpenAI();
  const model = process.env.MISTRAL_VISION_MODEL ?? "pixtral-12b-2409";

  const completion = await client.chat.completions.create({
    model,
    temperature: 0,
    messages: [
      { role: "system", content: ANALYSE_SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyse ce document administratif et renvoie le JSON strict attendu.",
          },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  return JSON.parse(extractJson(typeof raw === "string" ? raw : "{}")) as AnalyseResult;
}
