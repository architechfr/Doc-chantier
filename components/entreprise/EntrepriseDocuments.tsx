import type { DocumentRow } from "@/types/document";
import { DocumentsTable } from "@/components/dashboard/DocumentsTable";
import { ExpirationAlert } from "@/components/dashboard/ExpirationAlert";

export function EntrepriseDocuments({
  documents,
}: {
  documents: DocumentRow[];
}) {
  return (
    <div className="space-y-4">
      <ExpirationAlert documents={documents} />
      <DocumentsTable documents={documents} />
    </div>
  );
}
