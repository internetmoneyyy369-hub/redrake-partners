-- ============================================================
-- RedRake Partners — Seed Data (Dev/Staging only)
-- ============================================================

-- Seed campaigns
INSERT INTO campaigns (name, slug, destination_url, whatsapp_number, payout_per_lead, status)
VALUES
  ('IPL Fantasy League', 'ipl-fantasy', 'https://redrake.io/lp/ipl', '919876543210', 25.00, 'active'),
  ('Casino Royale Signup', 'casino-royale', 'https://redrake.io/lp/casino', '919876543211', 50.00, 'active'),
  ('Sports Betting Pro', 'sports-betting', 'https://redrake.io/lp/sports', '919876543212', 30.00, 'paused')
ON CONFLICT (slug) DO NOTHING;
