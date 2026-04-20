-- Add upfront payment amount in IDR (replaces upfront_months)
ALTER TABLE long_term_rentals
  ADD COLUMN IF NOT EXISTS upfront_amount_idr numeric;

-- available_to, kitchen, private_space already exist
