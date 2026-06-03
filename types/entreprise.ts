export interface Entreprise {
  id: string;
  name: string;
  siret: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
}

/** Rattachement d'une entreprise à un chantier (lot, rôle). */
export interface ChantierEntreprise {
  id: string;
  chantier_id: string;
  entreprise_id: string;
  lot: string | null;
  role: string | null;
  created_at: string;
}
