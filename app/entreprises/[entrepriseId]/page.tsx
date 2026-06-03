import { notFound } from "next/navigation";
import { getEntreprise, getDocuments } from "@/lib/data";
import { EntrepriseCard } from "@/components/entreprise/EntrepriseCard";
import { EntrepriseDocuments } from "@/components/entreprise/EntrepriseDocuments";

export default async function EntreprisePage({
  params,
}: {
  params: Promise<{ entrepriseId: string }>;
}) {
  const { entrepriseId } = await params;
  const entreprise = await getEntreprise(entrepriseId);
  if (!entreprise) notFound();

  const documents = await getDocuments({ entrepriseId });

  return (
    <div className="space-y-6">
      <EntrepriseCard entreprise={entreprise} />
      <EntrepriseDocuments documents={documents} />
    </div>
  );
}
