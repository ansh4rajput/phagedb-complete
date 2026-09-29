-- PhageDB production-oriented PostgreSQL / Supabase starter schema.
-- Review with your database/security team before production use.

create extension if not exists pgcrypto;

create type phage_record_status as enum ('draft','pending_review','verified','rejected','embargoed');
create type record_visibility as enum ('public','embargoed','private');
create type member_role as enum ('researcher','curator','admin');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  institute text,
  orcid text,
  role member_role not null default 'researcher',
  created_at timestamptz not null default now()
);

create table if not exists phages (
  id uuid primary key default gen_random_uuid(),
  repository_id text not null unique,
  accession text unique,
  name text not null,
  alternative_name text,
  phage_type text not null,
  status phage_record_status not null default 'draft',
  visibility record_visibility not null default 'public',
  contributor_id uuid references profiles(id),
  curator_id uuid references profiles(id),
  version numeric(6,2) not null default 1.0,
  verified_at timestamptz,

  host text not null,
  host_strain text,
  host_collection_id text,
  host_origin text,
  gram_stain text,
  clinical_importance text,
  antibiotic_resistance_profile text,

  isolation_date date,
  isolation_site text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  sample_type text,
  environmental_source text,
  collected_by text,
  isolation_method text,

  taxonomic_order text,
  family text,
  subfamily text,
  genus text,
  species text,
  ictv_status text,

  genome_type text,
  sequencing_platform text,
  genome_size_bp bigint,
  gc_content numeric(5,2),
  genome_ends text,
  assembly_status text,
  coverage text,
  genbank_accession text,

  plaque_morphology text,
  plaque_diameter text,
  plaque_appearance text,
  halo text,
  margin text,
  elevation text,

  capsid_shape text,
  tail_type text,
  capsid_diameter_nm numeric,
  tail_length_nm numeric,
  tail_width_nm numeric,
  collar text,
  base_plate text,
  tail_fibers text,
  morphotype text,

  adsorption_time text,
  adsorption_rate text,
  latent_period text,
  eclipse_period text,
  rise_period text,
  burst_size text,
  optimal_moi text,
  life_cycle text,

  growth_temperature text,
  optimal_ph text,
  optimal_host_density text,
  maximum_pfu text,

  stock_titer text,
  storage_buffer text,
  storage_temperature text,
  cryoprotectant text,
  freeze_thaw_cycles text,
  freezer text,
  rack text,
  box text,
  position text,

  contact_email text,
  institute text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists host_range_tests (
  id uuid primary key default gen_random_uuid(),
  phage_id uuid not null references phages(id) on delete cascade,
  bacterial_host text not null,
  strain text,
  susceptible boolean,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists stability_results (
  id uuid primary key default gen_random_uuid(),
  phage_id uuid not null references phages(id) on delete cascade,
  axis text not null check (axis in ('temperature','ph')),
  condition_value text not null,
  result text not null,
  replicate_count integer,
  notes text
);

create table if not exists genome_annotations (
  phage_id uuid primary key references phages(id) on delete cascade,
  total_orfs integer,
  coding_density numeric(5,2),
  trna_genes integer,
  rrna_genes integer,
  integrase text,
  repressor text,
  virulence_genes text,
  amr_genes text,
  lysogeny_genes text,
  lifestyle_prediction text,
  annotation_pipeline text,
  annotation_version text
);

create table if not exists functional_proteins (
  id uuid primary key default gen_random_uuid(),
  phage_id uuid not null references phages(id) on delete cascade,
  protein_name text not null,
  predicted_function text,
  locus_tag text,
  evidence text
);

create table if not exists repository_files (
  id uuid primary key default gen_random_uuid(),
  phage_id uuid not null references phages(id) on delete cascade,
  file_kind text not null,
  storage_path text not null,
  original_name text not null,
  mime_type text,
  size_bytes bigint,
  sha256 text,
  visibility record_visibility not null default 'public',
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists protocols (
  id uuid primary key default gen_random_uuid(),
  phage_id uuid references phages(id) on delete cascade,
  title text not null,
  version text,
  file_id uuid references repository_files(id),
  doi_or_url text
);

create table if not exists publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  citation text not null,
  doi text,
  pubmed_id text,
  url text,
  publication_year integer
);

create table if not exists phage_publications (
  phage_id uuid not null references phages(id) on delete cascade,
  publication_id uuid not null references publications(id) on delete cascade,
  primary key (phage_id, publication_id)
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  phage_id uuid references phages(id) on delete cascade,
  actor_id uuid references profiles(id),
  action text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create table if not exists curator_comments (
  id uuid primary key default gen_random_uuid(),
  phage_id uuid not null references phages(id) on delete cascade,
  author_id uuid not null references profiles(id),
  comment text not null,
  internal_only boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_phages_name on phages(lower(name));
create index if not exists idx_phages_host on phages(lower(host));
create index if not exists idx_phages_status on phages(status);
create index if not exists idx_phages_institute on phages(lower(institute));
create index if not exists idx_files_phage on repository_files(phage_id);
create index if not exists idx_audit_phage on audit_logs(phage_id, created_at desc);

-- Basic RLS starting point. Adjust policies to match institutional governance.
alter table profiles enable row level security;
alter table phages enable row level security;
alter table host_range_tests enable row level security;
alter table stability_results enable row level security;
alter table genome_annotations enable row level security;
alter table functional_proteins enable row level security;
alter table repository_files enable row level security;
alter table protocols enable row level security;
alter table publications enable row level security;
alter table phage_publications enable row level security;
alter table curator_comments enable row level security;

create policy "public verified phages are readable"
on phages for select
using (visibility = 'public' and status = 'verified');

create policy "contributors can read their records"
on phages for select to authenticated
using (contributor_id = auth.uid());

create policy "contributors can create records"
on phages for insert to authenticated
with check (contributor_id = auth.uid());

create policy "contributors can update draft or pending own records"
on phages for update to authenticated
using (contributor_id = auth.uid() and status in ('draft','pending_review'))
with check (contributor_id = auth.uid());

-- Curator/admin write policies are best implemented with a secure role claim or server-side service layer.
