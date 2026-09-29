-- ── SmartSpace Picks: Products table ─────────────────────────────────────────
-- Run this migration in Supabase SQL Editor or via supabase db push.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists products (
  -- Identity
  id            text        primary key,
  name          text        not null,
  slug          text        not null unique,

  -- Taxonomy
  category_slug    text     not null,
  subcategory_slug text     not null default '',

  -- Editorial
  badge            text,
  short_description text    not null default '',
  review_summary   text    not null default '',

  -- Affiliate
  amazon_url   text        not null default '',
  price_range  text        not null default '',

  -- Media
  image        text        not null default '',

  -- Structured content (JSONB arrays / objects)
  best_for          jsonb   not null default '[]',
  not_ideal_for     jsonb   not null default '[]',
  specs             jsonb   not null default '{}',
  pros              jsonb   not null default '[]',
  cons              jsonb   not null default '[]',
  scores            jsonb   not null default '{}',
  alternatives      jsonb   not null default '[]',
  related_guide_slugs jsonb not null default '[]',

  -- Workflow
  status    text  not null default 'draft'
            check (status in ('published', 'draft')),
  archived  boolean not null default false,

  -- Timestamps
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes
create index if not exists products_category_slug_idx on products (category_slug);
create index if not exists products_status_idx         on products (status);
create index if not exists products_archived_idx       on products (archived);
create index if not exists products_updated_at_idx     on products (updated_at desc);

-- Auto-update updated_at on every row change
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

-- Row Level Security: allow service role full access (admin only via service key)
alter table products enable row level security;

-- No public read policy — all access goes through service role key on the server.
-- Add a policy below only if you want anonymous/authenticated users to read products via Supabase directly.
-- create policy "Public read published products"
--   on products for select
--   using (status = 'published' and archived = false);
