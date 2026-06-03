import type { Chantier } from "@/types/chantier";
import type { Entreprise } from "@/types/entreprise";
import type { DocumentRow } from "@/types/document";

/**
 * Jeu de données de démonstration utilisé quand Supabase n'est pas configuré.
 * Permet de visualiser l'UI sans backend. Voir README > Mode démo.
 */

export const DEMO_CHANTIERS: Chantier[] = [
  {
    id: "demo-chantier-1",
    name: "Les Jardins de Lisa",
    address: "12 rue des Tilleuls, 31000 Toulouse",
    client_name: "SCI Lisa Promotion",
    start_date: "2026-01-15",
    end_date: "2027-03-30",
    created_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "demo-chantier-2",
    name: "Résidence Le Belvédère",
    address: "5 avenue de la Gare, 31700 Blagnac",
    client_name: "Cadence Promotion",
    start_date: "2026-04-01",
    end_date: "2027-09-15",
    created_at: "2026-03-20T09:00:00Z",
  },
];

export const DEMO_ENTREPRISES: Entreprise[] = [
  {
    id: "demo-entreprise-1",
    name: "Maçonnerie Garcia SARL",
    siret: "812 345 678 00021",
    contact_name: "Antoine Garcia",
    contact_email: "contact@maconnerie-garcia.fr",
    contact_phone: "05 61 00 00 01",
    created_at: "2026-01-12T09:00:00Z",
  },
  {
    id: "demo-entreprise-2",
    name: "ÉlecPro 31",
    siret: "534 987 654 00018",
    contact_name: "Sophie Marin",
    contact_email: "s.marin@elecpro31.fr",
    contact_phone: "05 61 00 00 02",
    created_at: "2026-01-18T09:00:00Z",
  },
];

/** Documents de démo, statuts variés pour illustrer les badges. */
export const DEMO_DOCUMENTS: DocumentRow[] = [
  {
    id: "demo-doc-1",
    name: "Extrait Kbis",
    issuer: "Greffe du Tribunal de Commerce de Toulouse",
    expiryDate: "2026-07-15",
    status: "valid",
    onlineCheckAvailable: false,
  },
  {
    id: "demo-doc-2",
    name: "Attestation de vigilance URSSAF",
    issuer: "URSSAF Midi-Pyrénées",
    expiryDate: "2026-06-20",
    status: "renewal_soon",
    onlineCheckAvailable: true,
  },
  {
    id: "demo-doc-3",
    name: "Assurance décennale",
    issuer: "SMABTP",
    expiryDate: "2025-12-31",
    status: "expired",
    onlineCheckAvailable: false,
  },
  {
    id: "demo-doc-4",
    name: "Assurance responsabilité civile professionnelle",
    issuer: "AXA",
    expiryDate: "2026-12-31",
    status: "valid",
    onlineCheckAvailable: false,
  },
  {
    id: "demo-doc-5",
    name: "Attestation de régularité fiscale",
    issuer: "—",
    expiryDate: null,
    status: "missing",
    onlineCheckAvailable: false,
  },
  {
    id: "demo-doc-6",
    name: "Liste nominative des salariés",
    issuer: "Maçonnerie Garcia SARL",
    expiryDate: null,
    status: "needs_review",
    onlineCheckAvailable: false,
  },
];
