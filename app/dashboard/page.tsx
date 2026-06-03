import { getDocuments } from "@/lib/data";
import { DocumentsTable } from "@/components/dashboard/DocumentsTable";
import { ExpirationAlert } from "@/components/dashboard/ExpirationAlert";

export default async function DashboardPage() {
  const documents = await getDocuments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-slate-500">
          Vue d&apos;ensemble des documents administratifs suivis.
        </p>
      </div>

      <ExpirationAlert documents={documents} />
      <DocumentsTable documents={documents} />
    </div>
  );
}
