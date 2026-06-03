import { effectiveExpiry, daysBetween } from "@/lib/validity";

/** Jalons d'alerte avant expiration (en jours). */
export const ALERT_OFFSETS_DAYS = [30, 15, 7];

export interface PlannedAlert {
  alertDate: string; // AAAA-MM-JJ
  offsetDays: number;
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Calcule les dates d'alerte (J-30, J-15, J-7) pour un document à partir de
 * sa date d'expiration effective. Ignore les jalons déjà passés par rapport à `now`.
 */
export function planAlerts(params: {
  code: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  now?: Date;
}): PlannedAlert[] {
  const expiry = effectiveExpiry(
    params.code,
    params.issueDate,
    params.expiryDate,
  );
  if (!expiry) return [];

  const now = params.now ?? new Date();

  return ALERT_OFFSETS_DAYS.map((offset) => {
    const alertDate = new Date(expiry.getTime());
    alertDate.setDate(alertDate.getDate() - offset);
    return { alertDate, offsetDays: offset };
  })
    .filter(({ alertDate }) => daysBetween(now, alertDate) >= 0)
    .map(({ alertDate, offsetDays }) => ({
      alertDate: toISODate(alertDate),
      offsetDays,
    }));
}
