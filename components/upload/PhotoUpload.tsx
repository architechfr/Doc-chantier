"use client";

import { useState } from "react";
import type { AnalyseResult } from "@/types/document";
import { OCRPreview } from "./OCRPreview";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function PhotoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyseResult | null>(null);

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await fetch("/api/analyse-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, filename: file.name }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Échec de l'analyse.");
      }
      setResult(json.result as AnalyseResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Importer un document
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Prenez une photo ou importez un PDF administratif.
      </p>

      <input
        type="file"
        accept="image/*,.pdf"
        capture="environment"
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null);
          setResult(null);
          setError(null);
        }}
        className="mt-4 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700"
      />

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="mt-4 w-full rounded-lg bg-blue-700 px-4 py-3 text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? "Analyse en cours..." : "Analyser le document"}
      </button>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && <OCRPreview result={result} />}
    </div>
  );
}
