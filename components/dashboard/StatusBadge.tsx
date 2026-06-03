const labels = {
  valid: "Valide",
  expired: "Expiré",
  renewal_soon: "À renouveler",
  missing: "Manquant",
  needs_review: "À vérifier",
} as const;

const styles = {
  valid: "bg-green-50 text-green-700",
  expired: "bg-red-50 text-red-700",
  renewal_soon: "bg-orange-50 text-orange-700",
  missing: "bg-slate-100 text-slate-700",
  needs_review: "bg-blue-50 text-blue-700",
} as const;

export type BadgeStatus = keyof typeof labels;

export function StatusBadge({ status }: { status: BadgeStatus }) {
  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
