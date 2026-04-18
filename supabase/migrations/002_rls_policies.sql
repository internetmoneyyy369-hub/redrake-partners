-- ============================================================
-- RedRake Partners — RLS Policies
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE creatives ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION auth_user_id()
RETURNS UUID AS $$
  SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub' LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION auth_user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE clerk_id = auth.jwt() ->> 'sub' LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT auth_user_role() IN ('admin','super_admin','finance','ops');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- users
CREATE POLICY "users: own row" ON users FOR SELECT USING (id = auth_user_id());
CREATE POLICY "users: admin all" ON users FOR ALL USING (is_admin());

-- affiliate_profiles
CREATE POLICY "affiliate_profiles: own" ON affiliate_profiles FOR SELECT USING (user_id = auth_user_id());
CREATE POLICY "affiliate_profiles: own update" ON affiliate_profiles FOR UPDATE USING (user_id = auth_user_id());
CREATE POLICY "affiliate_profiles: admin all" ON affiliate_profiles FOR ALL USING (is_admin());

-- kyc_records
CREATE POLICY "kyc: own" ON kyc_records FOR ALL USING (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth_user_id()));
CREATE POLICY "kyc: admin all" ON kyc_records FOR ALL USING (is_admin());

-- affiliate_links
CREATE POLICY "links: own" ON affiliate_links FOR ALL USING (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth_user_id()));
CREATE POLICY "links: admin all" ON affiliate_links FOR ALL USING (is_admin());

-- clicks
CREATE POLICY "clicks: own read" ON clicks FOR SELECT USING (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth_user_id()));
CREATE POLICY "clicks: admin all" ON clicks FOR ALL USING (is_admin());

-- leads
CREATE POLICY "leads: own read" ON leads FOR SELECT USING (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth_user_id()));
CREATE POLICY "leads: admin all" ON leads FOR ALL USING (is_admin());

-- wallets
CREATE POLICY "wallets: own" ON wallets FOR SELECT USING (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth_user_id()));
CREATE POLICY "wallets: admin all" ON wallets FOR ALL USING (is_admin());

-- commission_ledger
CREATE POLICY "ledger: own read" ON commission_ledger FOR SELECT USING (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth_user_id()));
CREATE POLICY "ledger: admin all" ON commission_ledger FOR ALL USING (is_admin());

-- withdrawal_requests
CREATE POLICY "withdrawals: own" ON withdrawal_requests FOR ALL USING (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth_user_id()));
CREATE POLICY "withdrawals: admin all" ON withdrawal_requests FOR ALL USING (is_admin());

-- creatives
CREATE POLICY "creatives: read all approved" ON creatives FOR SELECT USING (is_active = TRUE);
CREATE POLICY "creatives: admin all" ON creatives FOR ALL USING (is_admin());

-- support_tickets
CREATE POLICY "tickets: own" ON support_tickets FOR ALL USING (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth_user_id()));
CREATE POLICY "tickets: admin all" ON support_tickets FOR ALL USING (is_admin());
