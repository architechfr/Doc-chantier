import Link from "next/link";
import { getChantiers } from "@/lib/data";

export default async function ChantiersPage() {
  const chantiers = await getChantiers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Chantiers</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {chantiers.map((c) => (
          <Link
            key={c.id}
            href={`/chantiers/${c.id}`}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-300"
          >
            <h2 className="font-semibold text-slate-900">{c.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{c.address}</p>
            <p className="mt-2 text-xs text-slate-400">
              {c.client_name} · {c.start_date} → {c.end_date}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
