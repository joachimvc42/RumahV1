-- Flexible payment conditions (free-text)
-- Replaces the upfront_months / upfront_amount_idr pair. Each rental has its own
-- negotiated upfront arrangement (e.g. "2 years paid upfront on a 5-year lease"),
-- so a single free-text field is more appropriate than a fixed numeric column.
ALTER TABLE long_term_rentals
  ADD COLUMN IF NOT EXISTS payment_terms text;
