import "server-only";
import { isSupabaseConfigured, createServiceClient } from "@/lib/supabase";
import { computeStatus } from "@/lib/validity";
import { RULES_BY_CODE } from "@/lib/document-rules";
import type { Chantier } from "@/types/chantier";
import type { Entreprise } from "@/types/entreprise";
import type { DocumentRow, DocumentStatus } from "@/types/document";
import {
  DEMO_CHANTIERS,
  DEMO_ENTREPRISES,
  DEMO_DOCUMENTS,
} from "@/lib/demo-data";

/**
 * Toutes les lectures passent ici. En l'absence de configuration Supabase,
 * on renvoie le jeu de démo pour garder l'app navigable.
 */

export async function getChantiers(): Promise<Chantier[]> {
  if (!isSupabaseConfigured()) return DEMO_CHANTIERS;
  const sb = createServiceClient();
  const { data, error } = await sb
    .from("chantiers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Chantier[];
}

export async function getChantier(id: string): Promise<Chantier | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_CHANTIERS.find((c) => c.id === id) ?? null;
  }
  const sb = createServiceClient();
  const { data } = await sb.from("chantiers").select("*").eq("id", id).single();
  return (data as Chantier) ?? null;
}

export async function getEntreprise(id: string): Promise<Entreprise | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_ENTREPRISES.find((e) => e.id === id) ?? null;
  }
  const sb = createServiceClient();
  const { data } = await sb
    .from("entreprises")
    .select("*")
    .eq("id", id)
    .single();
  return (data as Entreprise) ?? null;
}

export async function getEntreprises(): Promise<Entreprise[]> {
  if (!isSupabaseConfigured()) return DEMO_ENTREPRISES;
  const sb = createServiceClient();
  const { data, error } = await sb
    .from("entreprises")
    .select("*")
    .order("name");
  if (error) throw error;
  return (data ?? []) as Entreprise[];
}

interface DbDocument {
  id: string;
  issuer: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  file_url: string | null;
  status: DocumentStatus;
  document_types: { code: string; name: string; online_check_available: boolean } | null;
}

function toRow(doc: DbDocument): DocumentRow {
  const code = doc.document_types?.code ?? null;
  const status = computeStatus({
    code,
    issueDate: doc.issue_date,
    expiryDate: doc.expiry_date,
    hasFile: Boolean(doc.file_url),
  });
  return {
    id: doc.id,
    name: doc.document_types?.name ?? "Document",
    issuer: doc.issuer ?? "",
    expiryDate: doc.expiry_date,
    status: status === "pending" ? "needs_review" : status,
    onlineCheckAvailable:
      doc.document_types?.online_check_available ??
      (code ? Boolean(RULES_BY_CODE[code]?.onlineCheck) : false),
  };
}

/** Documents pour une entreprise (optionnellement filtrés par chantier). */
export async function getDocuments(filter?: {
  entrepriseId?: string;
  chantierId?: string;
}): Promise<DocumentRow[]> {
  if (!isSupabaseConfigured()) return DEMO_DOCUMENTS;

  const sb = createServiceClient();
  let query = sb
    .from("documents")
    .select(
      "id, issuer, issue_date, expiry_date, file_url, status, document_types(code, name, online_check_available)",
    );

  if (filter?.entrepriseId) query = query.eq("entreprise_id", filter.entrepriseId);
  if (filter?.chantierId) query = query.eq("chantier_id", filter.chantierId);

  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as unknown as DbDocument[]).map(toRow);
}
