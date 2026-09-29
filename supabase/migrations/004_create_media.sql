-- 004_create_media.sql
-- Tracks uploaded files in Supabase Storage bucket "affiliate-media".
--
-- BUCKET SETUP (run once in Supabase Dashboard → Storage):
--   1. Create bucket named: affiliate-media
--   2. Set to Public so image URLs are directly accessible without signed URLs.
--   3. No additional bucket policy needed for public read; service role handles writes.
--
-- Recommended folder structure inside the bucket:
--   products/    → product hero images
--   guides/      → guide hero images
--   deals/       → deal card images
--   homepage/    → hero, banner, featured section images
--   categories/  → category thumbnail images
--   misc/        → everything else
--
-- Service role key is used server-side for all uploads and deletes.
-- Public image URLs follow the pattern:
--   https://<project>.supabase.co/storage/v1/object/public/affiliate-media/<path>

create table if not exists media_assets (
  id               text primary key,
  bucket           text not null default 'affiliate-media',
  path             text not null unique,
  url              text not null,
  filename         text not null,
  original_filename text,
  mime_type        text,
  size_bytes       integer,
  width            integer,
  height           integer,
  alt_text         text,
  title            text,
  folder           text not null default 'misc',
  usage_type       text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  archived         boolean not null default false
);

create index if not exists media_assets_path_idx        on media_assets(path);
create index if not exists media_assets_folder_idx      on media_assets(folder);
create index if not exists media_assets_usage_type_idx  on media_assets(usage_type);
create index if not exists media_assets_archived_idx    on media_assets(archived);
create index if not exists media_assets_created_at_idx  on media_assets(created_at);

alter table media_assets enable row level security;

-- No public read policy — all DB access goes through service role key server-side.

create or replace function update_media_assets_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger media_assets_updated_at
  before update on media_assets
  for each row execute function update_media_assets_updated_at();
