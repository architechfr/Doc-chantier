import type { DocumentRow } from "@/types/document";

/**
 * Bandeau récapitulatif des documents nécessitant une action
 * (expirés, à renouveler, manquants, à vérifier).
 */
export function ExpirationAlert({ documents }: { documents: DocumentRow[] }) {
  const expired = documents.filter((d) => d.status === "expired").length;
  const soon = documents.filter((d) => d.status === "renewal_soon").length;
  const missing = documents.filter((d) => d.status === "missing").length;
  const review = documents.filter((d) => d.status === "needs_review").length;

  const total = expired + soon + missing + review;

  if (total === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
        ✓ Tous les documents suivis sont à jour.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
      <p className="text-sm font-medium text-orange-900">
        {total} point{total > 1 ? "s" : ""} d&apos;attention
      </p>
      <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-orange-800">
        {expired > 0 && <li>{expired} expiré{expired > 1 ? "s" : ""}</li>}
        {soon > 0 && <li>{soon} à renouveler</li>}
        {missing > 0 && <li>{missing} manquant{missing > 1 ? "s" : ""}</li>}
        {review > 0 && <li>{review} à vérifier</li>}
      </ul>
    </div>
  );
}
