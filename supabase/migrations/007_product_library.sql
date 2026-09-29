-- Migration 007: Product Library upgrades
-- Run manually via Supabase Dashboard → SQL Editor

-- 1. New columns on products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS asin         TEXT,
  ADD COLUMN IF NOT EXISTS price_label  TEXT CHECK (price_label IN ('Budget','Mid-range','Premium','Check Amazon')),
  ADD COLUMN IF NOT EXISTS use_case     TEXT,
  ADD COLUMN IF NOT EXISTS source_notes TEXT;

-- 2. Widen status CHECK to include 'verified'
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_status_check;
ALTER TABLE products ADD CONSTRAINT products_status_check
  CHECK (status IN ('draft','verified','published'));

-- 3. Sparse unique index: two active products cannot share an ASIN
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_asin_unique
  ON products (asin)
  WHERE asin IS NOT NULL AND archived = false;
