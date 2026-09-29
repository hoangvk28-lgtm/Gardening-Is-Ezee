-- 005_create_site_settings.sql
-- Key-value store for CMS-editable site settings.
-- Each row = one logical settings group (homepage, global, footer, affiliate, navigation).
-- Values are JSONB so each group can hold any structure without schema changes.

create table if not exists site_settings (
  id          text primary key,
  key         text unique not null,
  value       jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists site_settings_key_idx        on site_settings(key);
create index if not exists site_settings_updated_at_idx on site_settings(updated_at);

alter table site_settings enable row level security;

-- All access via service role key server-side only.

create or replace function update_site_settings_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger site_settings_updated_at
  before update on site_settings
  for each row execute function update_site_settings_updated_at();
