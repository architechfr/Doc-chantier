import type { DocumentRow } from "@/types/document";
import { StatusBadge } from "./StatusBadge";

export function DocumentsTable({ documents }: { documents: DocumentRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="font-semibold text-slate-900">
          Documents administratifs
        </h2>
      </div>

      {documents.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-slate-500">
          Aucun document pour l&apos;instant. Importez une pièce pour démarrer.
        </p>
      ) : (
        <div className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="grid grid-cols-1 gap-2 px-4 py-4 md:grid-cols-5 md:items-center"
            >
              <div className="font-medium text-slate-900">{doc.name}</div>

              <div className="text-sm text-slate-500">
                {doc.issuer || "Organisme non identifié"}
              </div>

              <div className="text-sm text-slate-700">
                {doc.expiryDate
                  ? `Valide jusqu'au ${doc.expiryDate}`
                  : "Date inconnue"}
              </div>

              <StatusBadge status={doc.status} />

              <div>
                {doc.onlineCheckAvailable && (
                  <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50">
                    Vérifier en ligne
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
