-- Adds a "sea view" tag to villas (properties) and land plots (lands).
-- Surfaced as a filterable amenity on the public investments listing.
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS sea_view boolean DEFAULT false;
ALTER TABLE public.lands ADD COLUMN IF NOT EXISTS sea_view boolean DEFAULT false;
