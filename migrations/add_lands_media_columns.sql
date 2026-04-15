-- Migration: add missing columns to the `lands` table
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query)

ALTER TABLE lands
  ADD COLUMN IF NOT EXISTS description  text,
  ADD COLUMN IF NOT EXISTS land_size    numeric,
  ADD COLUMN IF NOT EXISTS currency     text    DEFAULT 'IDR',
  ADD COLUMN IF NOT EXISTS lease_years  integer,
  ADD COLUMN IF NOT EXISTS status       text    DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS zoning       text,
  ADD COLUMN IF NOT EXISTS images       text[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS videos       text[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS price_per_are_idr numeric;

-- After running the SQL above, also create the storage bucket in
-- Supabase Dashboard → Storage → New bucket:
--   Name   : lands
--   Public : true   (so images can be served via public URL)
--
-- Then add an RLS policy on the bucket to allow authenticated uploads:
--   INSERT policy: (auth.role() = 'authenticated')
