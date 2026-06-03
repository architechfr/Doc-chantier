import Link from "next/link";

const LINKS = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/chantiers", label: "Chantiers" },
  { href: "/documents/upload", label: "Importer" },
];

export function Nav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-700 text-sm font-bold text-white">
            DC
          </span>
          <span className="font-semibold text-slate-900">DocChantier</span>
        </Link>
        <nav className="flex gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
