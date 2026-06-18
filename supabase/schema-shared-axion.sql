-- ============================================================
-- DocChantier — schéma pour le Supabase PARTAGÉ d'Axion
-- (projet phfdrgvdfhwtyycxpahq). Toutes les tables sont préfixées
-- « dc_ » pour COHABITER sans collision avec les tables d'Axion
-- (notamment la table `documents` d'Axion, qui est différente).
--
-- ✅ SÛR à exécuter dans Supabase > SQL Editor : ne crée que des
--    tables dc_* nouvelles, ne touche à AUCUNE table existante d'Axion.
-- ⚠️ NE PAS exécuter l'ancien supabase/schema.sql sur ce projet
--    (il créerait/attendrait une table `documents` en conflit).
-- ============================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------
-- Tables (préfixe dc_)
-- ----------------------------------------------------------------

create table if not exists dc_chantiers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  client_name text,
  start_date date,
  end_date date,
  created_at timestamptz default now()
);

create table if not exists dc_entreprises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  siret text,
  contact_name text,
  contact_email text,
  contact_phone text,
  created_at timestamptz default now()
);

create table if not exists dc_chantier_entreprises (
  id uuid primary key default gen_random_uuid(),
  chantier_id uuid references dc_chantiers(id) on delete cascade,
  entreprise_id uuid references dc_entreprises(id) on delete cascade,
  lot text,
  role text,
  created_at timestamptz default now(),
  unique (chantier_id, entreprise_id, lot)
);

create table if not exists dc_document_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  renewal_months integer,
  required_by_default boolean default true,
  online_check_available boolean default false
);

create table if not exists dc_documents (
  id uuid primary key default gen_random_uuid(),
  chantier_id uuid references dc_chantiers(id) on delete cascade,
  entreprise_id uuid references dc_entreprises(id) on delete cascade,
  document_type_id uuid references dc_document_types(id),
  file_url text,
  issuer text,
  issue_date date,
  expiry_date date,
  status text default 'pending',
  confidence_score numeric,
  extracted_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists dc_document_history (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references dc_documents(id) on delete cascade,
  action text not null,
  previous_status text,
  new_status text,
  note text,
  created_at timestamptz default now()
);

create table if not exists dc_alerts (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references dc_documents(id) on delete cascade,
  alert_date date not null,
  channel text default 'email',
  sent boolean default false,
  created_at timestamptz default now()
);

-- ----------------------------------------------------------------
-- Index
-- ----------------------------------------------------------------

create index if not exists idx_dc_documents_entreprise on dc_documents(entreprise_id);
create index if not exists idx_dc_documents_chantier on dc_documents(chantier_id);
create index if not exists idx_dc_documents_expiry on dc_documents(expiry_date);
create index if not exists idx_dc_alerts_pending on dc_alerts(alert_date) where sent = false;

-- ----------------------------------------------------------------
-- updated_at automatique sur dc_documents (fonction préfixée)
-- ----------------------------------------------------------------

create or replace function dc_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_dc_documents_updated_at on dc_documents;
create trigger trg_dc_documents_updated_at
  before update on dc_documents
  for each row execute function dc_set_updated_at();

-- ----------------------------------------------------------------
-- Seed des types de documents (référentiel BTP)
-- ----------------------------------------------------------------

insert into dc_document_types (code, name, renewal_months, required_by_default, online_check_available)
values
  ('KBIS',               'Extrait Kbis',                                                        3,    true,  false),
  ('URSSAF',             'Attestation de vigilance URSSAF',                                     6,    true,  true),
  ('RC_PRO',             'Assurance responsabilité civile professionnelle',                     12,   true,  false),
  ('DECENNALE',          'Attestation décennale',                                               12,   true,  false),
  ('FISCAL',             'Attestation de régularité fiscale',                                   6,    true,  false),
  ('SALARIES_ETRANGERS', 'Liste des salariés étrangers soumis à autorisation de travail',       null, false, false),
  ('LISTE_SALARIES',     'Liste nominative des salariés susceptibles de travailler',            null, true,  false)
on conflict (code) do update
  set name = excluded.name,
      renewal_months = excluded.renewal_months,
      required_by_default = excluded.required_by_default,
      online_check_available = excluded.online_check_available;
