export type DocumentStatus =
  | "valid"
  | "expired"
  | "renewal_soon"
  | "missing"
  | "needs_review"
  | "pending";

/** Catégories reconnues par l'analyse IA. */
export type DocumentCategory =
  | "KBIS"
  | "URSSAF"
  | "RC_PRO"
  | "DECENNALE"
  | "FISCAL"
  | "QUALIBAT"
  | "CONGES_PAYES"
  | "ATTESTATION_HONNEUR"
  | "SALARIES_ETRANGERS"
  | "LISTE_SALARIES"
  | "LISTE_PIECES"
  | "UNKNOWN";

export interface DocumentType {
  id: string;
  code: string;
  name: string;
  renewal_months: number | null;
  required_by_default: boolean;
  online_check_available: boolean;
}

export interface DocumentRecord {
  id: string;
  chantier_id: string;
  entreprise_id: string;
  document_type_id: string | null;
  file_url: string | null;
  issuer: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  status: DocumentStatus;
  confidence_score: number | null;
  extracted_data: AnalyseResult | null;
  created_at: string;
  updated_at: string;
}

/** Réponse JSON stricte produite par le prompt système d'analyse IA. */
export interface AnalyseResult {
  document_detected: boolean;
  document_category: DocumentCategory;
  document_name: string | null;
  issuer: string | null;
  company_name: string | null;
  siret: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  validity_status: Exclude<DocumentStatus, "pending">;
  confidence_score: number;
  missing_documents: string[];
  detected_requirements: string[];
  alerts: string[];
  online_check_required: boolean;
  summary: string;
  recommended_action: string;
}

/** Ligne affichée dans le tableau de bord documents. */
export interface DocumentRow {
  id: string;
  name: string;
  issuer: string;
  expiryDate: string | null;
  status: Exclude<DocumentStatus, "pending">;
  onlineCheckAvailable: boolean;
}
