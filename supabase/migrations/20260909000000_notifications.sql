-- CeloHT notification infrastructure. Apply this migration in the authenticated
-- backend project; GitHub Pages cannot execute these server-side operations.
create table if not exists public.notification_preferences (
  wallet_address text primary key check (wallet_address = lower(wallet_address)),
  transaction_confirmed boolean not null default true,
  transaction_failed boolean not null default true,
  security_alert boolean not null default true,
  agent_activity boolean not null default false,
  reforestation_update boolean not null default true,
  celoht_announcement boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_wallet_address text not null check (recipient_wallet_address = lower(recipient_wallet_address)),
  type text not null check (type in ('transaction_confirmed', 'transaction_failed', 'security_alert', 'agent_activity', 'reforestation_update', 'celoht_announcement')),
  title text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  transaction_hash text,
  chain_id bigint,
  entity_id text,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  expires_at timestamptz,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'critical')),
  delivery_status text not null default 'pending' check (delivery_status in ('pending', 'delivered', 'failed')),
  deduplication_key text not null unique,
  created_by uuid,
  updated_at timestamptz not null default now()
);

create index if not exists notifications_recipient_idx on public.notifications (recipient_wallet_address);
create index if not exists notifications_created_idx on public.notifications (created_at desc);
create index if not exists notifications_read_idx on public.notifications (read_at);
create index if not exists notifications_type_idx on public.notifications (type);
create index if not exists notifications_dedupe_idx on public.notifications (deduplication_key);

create table if not exists public.notification_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null check (wallet_address = lower(wallet_address)),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  expires_at timestamptz
);
create index if not exists notification_push_wallet_idx on public.notification_push_subscriptions (wallet_address);

create table if not exists public.celoht_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  category text not null default 'general',
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'critical')),
  published_at timestamptz,
  expires_at timestamptz,
  deep_link text,
  active boolean not null default false,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists announcements_active_idx on public.celoht_announcements (active, published_at desc);
alter table public.celoht_announcements enable row level security;

alter table public.notification_preferences enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_push_subscriptions enable row level security;

create policy "users read active announcements" on public.celoht_announcements for select using (active = true and (published_at is null or published_at <= now()) and (expires_at is null or expires_at > now()));
-- Publishing requires a separately managed admin claim. Normal users have no insert/update/delete policy.
create policy "admins manage announcements" on public.celoht_announcements for all using ((auth.jwt()->>'celoht_role') = 'admin') with check ((auth.jwt()->>'celoht_role') = 'admin');

-- The authenticated backend must issue wallet_address as a verified JWT claim
-- after wallet signature verification. Service-role workers bypass RLS.
create policy "wallet owners read preferences" on public.notification_preferences for select using (wallet_address = lower(coalesce(auth.jwt()->>'wallet_address', '')));
create policy "wallet owners write preferences" on public.notification_preferences for all using (wallet_address = lower(coalesce(auth.jwt()->>'wallet_address', ''))) with check (wallet_address = lower(coalesce(auth.jwt()->>'wallet_address', '')));
create policy "wallet owners read notifications" on public.notifications for select using (recipient_wallet_address = lower(coalesce(auth.jwt()->>'wallet_address', '')));
create policy "wallet owners mark notifications read" on public.notifications for update using (recipient_wallet_address = lower(coalesce(auth.jwt()->>'wallet_address', ''))) with check (recipient_wallet_address = lower(coalesce(auth.jwt()->>'wallet_address', '')));
create policy "wallet owners manage push subscriptions" on public.notification_push_subscriptions for all using (wallet_address = lower(coalesce(auth.jwt()->>'wallet_address', ''))) with check (wallet_address = lower(coalesce(auth.jwt()->>'wallet_address', '')));