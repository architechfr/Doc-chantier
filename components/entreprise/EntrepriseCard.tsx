import type { Entreprise } from "@/types/entreprise";

export function EntrepriseCard({ entreprise }: { entreprise: Entreprise }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">{entreprise.name}</h1>

      <div className="mt-3 space-y-1 text-sm text-slate-600">
        <p>SIRET : {entreprise.siret || "Non renseigné"}</p>
        <p>Contact : {entreprise.contact_name || "Non renseigné"}</p>
        <p>Email : {entreprise.contact_email || "Non renseigné"}</p>
        <p>Téléphone : {entreprise.contact_phone || "Non renseigné"}</p>
      </div>
    </div>
  );
}
