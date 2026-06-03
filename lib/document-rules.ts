import type { DocumentCategory } from "@/types/document";

export interface DocumentRule {
  code: DocumentCategory;
  name: string;
  /** Durée de validité en mois (null = pas de renouvellement périodique). */
  renewalMonths: number | null;
  rule: string;
  onlineCheck: boolean;
  /** Requis par défaut sur un chantier (sert au calcul des pièces manquantes). */
  requiredByDefault: boolean;
}

export const DOCUMENT_RULES: DocumentRule[] = [
  {
    code: "KBIS",
    name: "Extrait Kbis",
    renewalMonths: 3,
    rule: "Doit dater de moins de 3 mois",
    onlineCheck: false,
    requiredByDefault: true,
  },
  {
    code: "URSSAF",
    name: "Attestation de vigilance URSSAF",
    renewalMonths: 6,
    rule: "À renouveler tous les 6 mois jusqu'à la fin du chantier",
    onlineCheck: true,
    requiredByDefault: true,
  },
  {
    code: "RC_PRO",
    name: "Assurance responsabilité civile professionnelle",
    renewalMonths: 12,
    rule: "Doit couvrir l'année en cours et les travaux concernés",
    onlineCheck: false,
    requiredByDefault: true,
  },
  {
    code: "DECENNALE",
    name: "Attestation décennale",
    renewalMonths: 12,
    rule: "Doit être valide pour les lots concernés",
    onlineCheck: false,
    requiredByDefault: true,
  },
  {
    code: "FISCAL",
    name: "Attestation de régularité fiscale",
    renewalMonths: 6,
    rule: "À renouveler régulièrement selon exigence chantier",
    onlineCheck: false,
    requiredByDefault: true,
  },
  {
    code: "SALARIES_ETRANGERS",
    name: "Liste des salariés étrangers soumis à autorisation de travail",
    renewalMonths: null,
    rule: "Obligatoire si l'entreprise emploie des salariés étrangers concernés",
    onlineCheck: false,
    requiredByDefault: false,
  },
  {
    code: "LISTE_SALARIES",
    name: "Liste nominative des salariés susceptibles de travailler sur le chantier",
    renewalMonths: null,
    rule: "Liste nominative à fournir pour le chantier",
    onlineCheck: false,
    requiredByDefault: true,
  },
];

export const RULES_BY_CODE: Record<string, DocumentRule> = Object.fromEntries(
  DOCUMENT_RULES.map((r) => [r.code, r]),
);

/** Codes des documents obligatoires par défaut sur un chantier. */
export const DEFAULT_REQUIRED_CODES = DOCUMENT_RULES.filter(
  (r) => r.requiredByDefault,
).map((r) => r.code);
