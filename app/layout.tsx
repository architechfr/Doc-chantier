import type { Metadata } from "next";
import "@/styles/globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "DocChantier — Suivi des attestations BTP",
  description:
    "Importez, analysez et suivez les documents administratifs obligatoires par chantier et entreprise.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Nav />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
