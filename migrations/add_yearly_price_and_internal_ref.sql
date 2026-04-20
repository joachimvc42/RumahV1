-- Yearly rental price
ALTER TABLE long_term_rentals
  ADD COLUMN IF NOT EXISTS yearly_price_idr numeric;

-- Internal reference (admin only, never shown to clients)
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS internal_ref text;
ALTER TABLE lands
  ADD COLUMN IF NOT EXISTS internal_ref text;
