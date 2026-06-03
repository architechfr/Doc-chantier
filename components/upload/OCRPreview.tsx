import type { AnalyseResult } from "@/types/document";
import { StatusBadge, type BadgeStatus } from "@/components/dashboard/StatusBadge";

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-sm text-slate-800">{value || "—"}</dd>
    </div>
  );
}

export function OCRPreview({ result }: { result: AnalyseResult }) {
  const status = result.validity_status as BadgeStatus;
  const confidence = Math.round((result.confidence_score ?? 0) * 100);

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">
          {result.document_name || result.document_category}
        </h3>
        <StatusBadge status={status} />
      </div>

      <p className="mt-1 text-xs text-slate-500">
        Catégorie : {result.document_category} · Confiance : {confidence}%
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        <Field label="Organisme émetteur" value={result.issuer} />
        <Field label="Entreprise" value={result.company_name} />
        <Field label="SIRET" value={result.siret} />
        <Field label="Date d'émission" value={result.issue_date} />
        <Field label="Date d'expiration" value={result.expiry_date} />
        <Field
          label="Vérification en ligne"
          value={result.online_check_required ? "Requise" : "Non"}
        />
      </dl>

      {result.summary && (
        <p className="mt-4 text-sm text-slate-700">{result.summary}</p>
      )}

      {result.recommended_action && (
        <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">
          Action recommandée : {result.recommended_action}
        </p>
      )}

      {result.missing_documents.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Pièces demandées / manquantes
          </p>
          <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
            {result.missing_documents.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      {result.alerts.length > 0 && (
        <ul className="mt-3 space-y-1">
          {result.alerts.map((a, i) => (
            <li
              key={i}
              className="rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-800"
            >
              ⚠ {a}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
