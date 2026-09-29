-- Migration 006: Add product_picks JSONB column to guides table
-- Run manually via Supabase Dashboard → SQL Editor
-- This allows guide articles to store inline product pick data
-- without requiring entries in the products table.

ALTER TABLE guides
  ADD COLUMN IF NOT EXISTS product_picks JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Index for queries that filter guides with product picks
CREATE INDEX IF NOT EXISTS idx_guides_product_picks_nonempty
  ON guides ((product_picks != '[]'::jsonb))
  WHERE product_picks != '[]'::jsonb AND archived = false;
