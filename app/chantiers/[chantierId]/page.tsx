import { notFound } from "next/navigation";
import Link from "next/link";
import { getChantier, getEntreprises, getDocuments } from "@/lib/data";
import { DocumentsTable } from "@/components/dashboard/DocumentsTable";
import { ExpirationAlert } from "@/components/dashboard/ExpirationAlert";

export default async function ChantierDetailPage({
  params,
}: {
  params: Promise<{ chantierId: string }>;
}) {
  const { chantierId } = await params;
  const chantier = await getChantier(chantierId);
  if (!chantier) notFound();

  const [entreprises, documents] = await Promise.all([
    getEntreprises(),
    getDocuments({ chantierId }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/chantiers" className="text-sm text-blue-700 hover:underline">
          ← Chantiers
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {chantier.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{chantier.address}</p>
      </div>

      <ExpirationAlert documents={documents} />

      <section>
        <h2 className="mb-3 font-semibold text-slate-900">
          Entreprises du chantier
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {entreprises.map((e) => (
            <Link
              key={e.id}
              href={`/entreprises/${e.id}`}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300"
            >
              <p className="font-medium text-slate-900">{e.name}</p>
              <p className="text-sm text-slate-500">
                SIRET : {e.siret ?? "—"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-slate-900">
          Documents du chantier
        </h2>
        <DocumentsTable documents={documents} />
      </section>
    </div>
  );
}
