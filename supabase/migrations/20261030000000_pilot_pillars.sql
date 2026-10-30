-- CeloHT controlled Sepolia pilot schema.
-- Supabase/Auth is the identity store; wallet verification is completed by the app backend.

create extension if not exists pgcrypto;

create type public.celoht_user_role as enum ('learner','agent_applicant','verified_agent','community_contributor','authorized_reviewer','admin');
create type public.agent_application_status as enum ('pending','under_review','approved','rejected','additional_information_required','suspended');
create type public.service_status as enum ('requested','confirmed','completed','cancelled','rejected');
create type public.reforestation_status as enum ('submitted','under_review','verified','rejected','needs_additional_evidence');

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null unique check (wallet_address = lower(wallet_address)),
  display_name text check (char_length(display_name) <= 100),
  role public.celoht_user_role not null default 'learner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  category text not null default 'General',
  language text not null check (language in ('ht','en','fr','es')),
  level text not null check (level in ('Beginner','Intermediate','Advanced')),
  passing_score integer not null default 70 check (passing_score between 1 and 100),
  published boolean not null default false,
  created_by text references public.profiles(wallet_address),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null unique references public.courses(id) on delete cascade,
  passing_score integer not null default 70 check (passing_score between 1 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  position integer not null check (position > 0),
  question text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array'),
  correct_option integer not null check (correct_option >= 0),
  unique(quiz_id, position)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  position integer not null check (position > 0),
  title text not null,
  content text not null,
  material_url text,
  unique(course_id, position)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  learner_wallet text not null references public.profiles(wallet_address) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique(course_id, learner_wallet)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  learner_wallet text not null references public.profiles(wallet_address) on delete cascade,
  completed_at timestamptz,
  unique(lesson_id, learner_wallet)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  learner_wallet text not null references public.profiles(wallet_address) on delete cascade,
  score integer not null check (score between 0 and 100),
  passed boolean not null,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_identifier text not null unique,
  course_id uuid not null references public.courses(id),
  learner_wallet text not null references public.profiles(wallet_address) on delete cascade,
  issued_at timestamptz not null default now(),
  unique(course_id, learner_wallet)
);

create table if not exists public.agent_applications (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null references public.profiles(wallet_address) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  contact text not null check (char_length(contact) <= 255),
  location text not null check (char_length(location) <= 255),
  community text not null check (char_length(community) <= 255),
  identity_document_url text,
  supporting_document_urls jsonb not null default '[]'::jsonb,
  status public.agent_application_status not null default 'pending',
  reviewer_notes text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_services (
  id uuid primary key default gen_random_uuid(),
  agent_wallet text not null references public.profiles(wallet_address),
  customer_reference text not null check (char_length(customer_reference) <= 255),
  service_type text not null check (service_type in ('cash_in_simulation','cash_out_simulation','wallet_onboarding','customer_support','other')),
  amount numeric(36,18),
  status public.service_status not null default 'requested',
  transaction_reference text,
  simulated boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reforestation_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  gps_lat numeric(9,6),
  gps_lng numeric(9,6),
  organization text,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.planting_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.reforestation_projects(id),
  project_name text not null,
  location text not null,
  gps_lat numeric(9,6),
  gps_lng numeric(9,6),
  species text not null,
  trees_planned integer not null default 0 check (trees_planned >= 0),
  trees_planted integer not null check (trees_planted >= 0),
  planting_date date not null,
  responsible_group text not null,
  supporting_document_urls jsonb not null default '[]'::jsonb,
  photograph_urls jsonb not null default '[]'::jsonb,
  status public.reforestation_status not null default 'submitted',
  submitted_by text not null references public.profiles(wallet_address),
  reviewed_by text,
  reviewed_at timestamptz,
  reviewer_notes text,
  verified_trees integer not null default 0 check (verified_trees >= 0 and verified_trees <= trees_planted),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tree_survival_records (
  id uuid primary key default gen_random_uuid(),
  planting_event_id uuid not null references public.planting_events(id) on delete cascade,
  follow_up_months integer not null check (follow_up_months in (6,18)),
  trees_inspected integer not null check (trees_inspected >= 0),
  trees_surviving integer not null check (trees_surviving >= 0 and trees_surviving <= trees_inspected),
  trees_lost integer not null check (trees_lost >= 0),
  inspection_date date not null,
  evidence_urls jsonb not null default '[]'::jsonb,
  responsible_reviewer text not null,
  reviewer_notes text,
  created_at timestamptz not null default now(),
  unique(planting_event_id, follow_up_months)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_wallet text,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists courses_published_idx on public.courses(published, category);
create index if not exists lessons_course_idx on public.lessons(course_id, position);
create index if not exists enrollments_wallet_idx on public.enrollments(learner_wallet);
create index if not exists progress_wallet_idx on public.lesson_progress(learner_wallet);
create index if not exists agent_applications_status_idx on public.agent_applications(status, created_at desc);
create index if not exists agent_services_wallet_idx on public.agent_services(agent_wallet, created_at desc);
create index if not exists planting_status_idx on public.planting_events(status, created_at desc);
create index if not exists planting_project_idx on public.planting_events(project_id);
create index if not exists audit_created_idx on public.audit_logs(created_at desc);

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.course_categories enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.certificates enable row level security;
alter table public.agent_applications enable row level security;
alter table public.agent_services enable row level security;
alter table public.reforestation_projects enable row level security;
alter table public.planting_events enable row level security;
alter table public.tree_survival_records enable row level security;
alter table public.audit_logs enable row level security;

create policy "categories public" on public.course_categories for select using (true);
create policy "published quizzes public" on public.quizzes for select using (exists (select 1 from public.courses c where c.id = course_id and c.published = true));
create policy "published quiz questions public" on public.quiz_questions for select using (exists (select 1 from public.quizzes q join public.courses c on c.id = q.course_id where q.id = quiz_id and c.published = true));
create policy "published courses public" on public.courses for select using (published = true);
create policy "published course lessons public" on public.lessons for select using (exists (select 1 from public.courses c where c.id = course_id and c.published = true));
create policy "projects public" on public.reforestation_projects for select using (active = true);
create policy "verified planting public" on public.planting_events for select using (status = 'verified');
create policy "survival records public" on public.tree_survival_records for select using (exists (select 1 from public.planting_events p where p.id = planting_event_id and p.status = 'verified'));
create policy "learners own enrollments" on public.enrollments for select using (learner_wallet = lower(coalesce(auth.jwt()->>'wallet_address','')));
create policy "learners own progress" on public.lesson_progress for select using (learner_wallet = lower(coalesce(auth.jwt()->>'wallet_address','')));
create policy "learners own attempts" on public.quiz_attempts for select using (learner_wallet = lower(coalesce(auth.jwt()->>'wallet_address','')));
create policy "learners own certificates" on public.certificates for select using (learner_wallet = lower(coalesce(auth.jwt()->>'wallet_address','')));
create policy "agents own applications" on public.agent_applications for select using (wallet_address = lower(coalesce(auth.jwt()->>'wallet_address','')));
create policy "agents own services" on public.agent_services for select using (agent_wallet = lower(coalesce(auth.jwt()->>'wallet_address','')));
