# DocChantier — Suivi des attestations administratives BTP

Importer une photo/PDF → l'IA identifie la pièce (Kbis, URSSAF, RC Pro, décennale…),
extrait dates et organisme, calcule le statut, et suit la conformité par
**chantier** et par **entreprise**.

Stack : **Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase · OpenAI Vision**.

---

## Démarrage rapide

```bash
npm install
cp .env.local.example .env.local   # puis renseigner les clés (facultatif au début)
npm run dev
```

Ouvrir http://localhost:3000.

### Mode démo (sans configuration)

Sans `.env.local`, l'app démarre en **mode démo** : chantiers, entreprises et
documents sont **fictifs** (voir `lib/demo-data.ts`) et l'analyse IA renvoie un
résultat simulé. Tout est navigable immédiatement, rien n'est écrit nulle part.

Le statut de configuration s'affiche sur la page d'accueil.

---

## Configuration

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon (client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service_role (**serveur uniquement**) |
| `SUPABASE_STORAGE_BUCKET` | Bucket de stockage des fichiers (défaut `documents`) |
| `OPENAI_API_KEY` | Active l'analyse IA réelle |
| `OPENAI_VISION_MODEL` | Modèle vision (défaut `gpt-4o`) |

### Base de données

Exécuter `supabase/schema.sql` dans **Supabase > SQL Editor**. Il crée les tables,
les index, le trigger `updated_at` et **seed** le référentiel `document_types`.

---

## Architecture

```
app/
  page.tsx                      Accueil + état de config
  dashboard/                    Vue d'ensemble documents
  chantiers/                    Liste + détail (entreprises, documents)
  entreprises/[entrepriseId]/   Fiche entreprise + ses documents
  documents/upload/             Import + analyse IA
  api/
    analyse-document/           Vision IA → JSON structuré (cœur)
    documents/                  Lecture documents (JSON)
    alerts/                     Calcul des jalons d'alerte J-30/15/7
    ocr/                        Réservé (OCR dédié, Phase 3)
components/  dashboard · upload · entreprise · ui
lib/         supabase · openai · document-rules · validity · alerts · data · demo-data
types/       chantier · entreprise · document
supabase/    schema.sql
```

### Logique métier clé

- **`lib/document-rules.ts`** — référentiel des pièces et de leurs règles
  (durée de validité, vérif en ligne, obligatoire par défaut).
- **`lib/validity.ts`** — `computeStatus()` dérive `valid / renewal_soon /
  expired / missing / needs_review`. La date d'expiration vient soit du document,
  soit de `issue_date + renewalMonths`. `now` est injectable (testable).
- **`lib/alerts.ts`** — `planAlerts()` calcule les dates J-30 / J-15 / J-7.
- **`lib/data.ts`** — accès lecture unifié : Supabase si configuré, sinon démo.

---

## Périmètre V1

**Inclus** : création chantier/entreprise (via SQL/Supabase pour l'instant),
import photo/PDF, analyse IA structurée, tableau de suivi, statuts automatiques,
calcul des alertes.

**Exclus** (roadmap) : authentification, écriture des documents en base depuis
l'UI (l'import analyse mais ne persiste pas encore), scraping URSSAF, envoi email
des alertes, signature électronique, support PDF dans la vision (images uniquement).

---

## Prochaines étapes recommandées

1. **Persister l'import** : après analyse, écrire le fichier dans Supabase Storage
   et insérer la ligne `documents` (route `POST /api/documents`).
2. **Formulaires de création** chantier / entreprise dans l'UI.
3. **Authentification** (Clerk ou NextAuth) + **RLS** Supabase.
4. **Cron alertes** (Phase 5) : balayer `documents`, créer/envoyer les `alerts`.
5. **Support PDF** : rendu page 1 en image avant analyse vision.

> ⚠️ Données sensibles : les pièces salariés (nationalité, titre de séjour)
> relèvent du RGPD. Prévoir minimisation, durée de conservation et accès restreint
> avant toute mise en production.
