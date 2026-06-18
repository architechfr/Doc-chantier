import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";
import { isOpenAIConfigured } from "@/lib/openai";

export default function HomePage() {
  const supabaseOk = isSupabaseConfigured();
  const openaiOk = isOpenAIConfigured();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Suivi administratif de chantier
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Importez une photo ou un PDF, laissez l&apos;IA identifier la pièce
          (Kbis, URSSAF, RC Pro, décennale…), ses dates et son statut, puis
          suivez la conformité par entreprise et par chantier.
        </p>
        <div className="mt-5 flex gap-3">
          <Link
            href="/documents/upload"
            className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-medium text-white hover:bg-blue-800"
          >
            Importer un document
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Voir le tableau de bord
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="font-semibold text-slate-900">Configuration</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Dot ok={supabaseOk} />
            Supabase {supabaseOk ? "configuré" : "non configuré — mode démo (données fictives)"}
          </li>
          <li className="flex items-center gap-2">
            <Dot ok={openaiOk} />
            Analyse IA {openaiOk ? "active (Mistral)" : "désactivée — définir MISTRAL_API_KEY"}
          </li>
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          Copiez <code>.env.local.example</code> en <code>.env.local</code> et
          renseignez vos clés. Voir le README.
        </p>
      </section>
    </div>
  );
}

function Dot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${ok ? "bg-green-500" : "bg-slate-300"}`}
    />
  );
}
