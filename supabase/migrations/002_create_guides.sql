-- ── Guides table ──────────────────────────────────────────────────────────────

create table if not exists guides (
  id                  text primary key,
  title               text not null,
  slug                text not null unique,
  category_slug       text not null,
  subcategory_slug    text not null default '',
  description         text not null default '',
  hero_image          text not null default '',
  hero_image_alt      text not null default '',
  meta_title          text not null default '',
  meta_description    text not null default '',
  main_keyword        text not null default '',
  sub_keywords        jsonb not null default '[]',
  intro               text not null default '',
  recommended_product_ids jsonb not null default '[]',
  comparison_order    jsonb not null default '[]',
  sections            jsonb not null default '[]',
  faq                 jsonb not null default '[]',
  related_guide_slugs jsonb not null default '[]',
  author              text not null default '',
  read_time           text not null default '',
  last_updated        text not null default '',
  status              text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  archived            boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ── updated_at trigger ────────────────────────────────────────────────────────

create or replace function set_guide_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists guides_set_updated_at on guides;
create trigger guides_set_updated_at
  before update on guides
  for each row execute function set_guide_updated_at();

-- ── Indexes ───────────────────────────────────────────────────────────────────

create index if not exists guides_category_slug_idx on guides (category_slug);
create index if not exists guides_status_idx on guides (status);
create index if not exists guides_archived_idx on guides (archived);
create index if not exists guides_updated_at_idx on guides (updated_at desc);

-- ── RLS ───────────────────────────────────────────────────────────────────────

alter table guides enable row level security;
-- No public read policy: access via service role key only
