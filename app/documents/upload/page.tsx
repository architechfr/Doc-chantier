import { PhotoUpload } from "@/components/upload/PhotoUpload";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Importer un document
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          L&apos;IA identifie automatiquement la pièce, l&apos;organisme, les
          dates et le statut.
        </p>
      </div>

      <PhotoUpload />
    </div>
  );
}
