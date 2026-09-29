-- 003_create_deals.sql

create table if not exists deals (
  id              text primary key,
  product_id      text,
  product_slug    text,
  title           text not null,
  slug            text not null unique,
  label           text not null default 'Worth checking',
  description     text not null default '',
  section         text not null default 'general',
  placement       text not null default 'deals',
  amazon_url_override text,
  cta_text        text not null default 'Check current price',
  price_range_override text,
  image_override  text,
  image_alt       text,
  featured        boolean not null default false,
  display_order   integer not null default 0,
  status          text not null default 'draft' check (status in ('draft', 'active', 'inactive', 'archived')),
  archived        boolean not null default false,
  starts_at       timestamptz,
  ends_at         timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists deals_status_idx on deals(status);
create index if not exists deals_archived_idx on deals(archived);
create index if not exists deals_featured_idx on deals(featured);
create index if not exists deals_section_idx on deals(section);
create index if not exists deals_display_order_idx on deals(display_order);
create index if not exists deals_slug_idx on deals(slug);

alter table deals enable row level security;

-- No public read policy — reads via service role key only (server-side)

create or replace function update_deals_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger deals_updated_at
  before update on deals
  for each row execute function update_deals_updated_at();
