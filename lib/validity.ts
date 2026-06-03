import type { DocumentStatus } from "@/types/document";
import { RULES_BY_CODE } from "@/lib/document-rules";

/** Seuil (en jours) sous lequel un document valide passe en "à renouveler". */
export const RENEWAL_WARNING_DAYS = 30;

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Ajoute n mois à une date (gère les débordements de fin de mois). */
export function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  const targetMonth = d.getMonth() + months;
  d.setMonth(targetMonth);
  return d;
}

export function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

/**
 * Date d'expiration effective d'un document.
 * Priorité à expiry_date explicite ; sinon dérivée de issue_date + renewalMonths.
 */
export function effectiveExpiry(
  code: string | null,
  issueDate: string | null,
  expiryDate: string | null,
): Date | null {
  const explicit = parseDate(expiryDate);
  if (explicit) return explicit;

  const issued = parseDate(issueDate);
  if (!issued || !code) return null;

  const rule = RULES_BY_CODE[code];
  if (!rule?.renewalMonths) return null;

  return addMonths(issued, rule.renewalMonths);
}

/**
 * Calcule le statut d'un document à une date donnée (par défaut: maintenant).
 * `now` est injectable pour rester testable et déterministe.
 */
export function computeStatus(params: {
  code: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  hasFile: boolean;
  now?: Date;
}): DocumentStatus {
  const { code, issueDate, expiryDate, hasFile } = params;
  const now = params.now ?? new Date();

  if (!hasFile) return "missing";

  const expiry = effectiveExpiry(code, issueDate, expiryDate);
  if (!expiry) return "needs_review";

  const remaining = daysBetween(now, expiry);
  if (remaining < 0) return "expired";
  if (remaining <= RENEWAL_WARNING_DAYS) return "renewal_soon";
  return "valid";
}
