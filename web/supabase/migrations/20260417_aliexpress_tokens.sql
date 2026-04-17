-- AliExpress OAuth token storage
-- Stores access_token + refresh_token per authorized AE seller account.
-- Service role key reads/writes; never exposed to the client.

create table if not exists public.aliexpress_tokens (
  id             uuid primary key default gen_random_uuid(),
  app_key        text not null,
  ae_user_id     text not null,
  ae_account     text,
  ae_seller_id   text,
  access_token   text not null,
  refresh_token  text not null,
  expires_at     timestamptz not null,
  refresh_expires_at timestamptz,
  scope          text,
  raw            jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (app_key, ae_user_id)
);

create index if not exists aliexpress_tokens_app_user_idx
  on public.aliexpress_tokens (app_key, ae_user_id);

create index if not exists aliexpress_tokens_expires_idx
  on public.aliexpress_tokens (expires_at);

alter table public.aliexpress_tokens enable row level security;

-- Only service_role can read/write this table.
drop policy if exists "service role full access" on public.aliexpress_tokens;
create policy "service role full access"
  on public.aliexpress_tokens
  for all
  to service_role
  using (true)
  with check (true);

-- Auto-update updated_at
create or replace function public.touch_aliexpress_tokens_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists aliexpress_tokens_touch_updated_at on public.aliexpress_tokens;
create trigger aliexpress_tokens_touch_updated_at
  before update on public.aliexpress_tokens
  for each row execute function public.touch_aliexpress_tokens_updated_at();
