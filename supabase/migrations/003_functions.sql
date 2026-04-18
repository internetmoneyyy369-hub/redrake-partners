-- ============================================================
-- RedRake Partners — SQL Functions
-- ============================================================

CREATE OR REPLACE FUNCTION increment_wallet_pending(p_affiliate_id UUID, p_amount NUMERIC)
RETURNS VOID AS $$
  UPDATE wallets SET pending_balance = pending_balance + p_amount
  WHERE affiliate_id = p_affiliate_id;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_link_clicks(p_link_id UUID)
RETURNS VOID AS $$
  UPDATE affiliate_links SET total_clicks = total_clicks + 1 WHERE id = p_link_id;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION release_held_commissions()
RETURNS void AS $$
BEGIN
  UPDATE commission_ledger
  SET status = 'approved', updated_at = NOW()
  WHERE status = 'on_hold' AND hold_until <= NOW();

  UPDATE wallets w SET
    pending_balance = (
      SELECT COALESCE(SUM(amount), 0) FROM commission_ledger
      WHERE affiliate_id = w.affiliate_id AND status = 'pending'
    ),
    approved_balance = (
      SELECT COALESCE(SUM(amount), 0) FROM commission_ledger
      WHERE affiliate_id = w.affiliate_id AND status = 'approved'
    ),
    on_hold_balance = (
      SELECT COALESCE(SUM(amount), 0) FROM commission_ledger
      WHERE affiliate_id = w.affiliate_id AND status = 'on_hold'
    ),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
