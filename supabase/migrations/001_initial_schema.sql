-- ============================================================
-- RedRake Partners — Initial Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── USERS ───
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id      TEXT UNIQUE NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  role          TEXT NOT NULL DEFAULT 'affiliate' CHECK (role IN ('affiliate','admin','super_admin','finance','ops')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── AFFILIATE PROFILES ───
CREATE TABLE affiliate_profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name           TEXT NOT NULL,
  phone               TEXT,
  city                TEXT,
  state               TEXT,
  language            TEXT DEFAULT 'en',
  tier                TEXT NOT NULL DEFAULT 'new' CHECK (tier IN ('new','bronze','silver','gold','platinum')),
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','under_review','approved','rejected','suspended')),
  rejection_reason    TEXT,
  assigned_manager_id UUID REFERENCES users(id),
  follower_count      INTEGER,
  primary_platform    TEXT CHECK (primary_platform IN ('instagram','youtube','twitter','telegram','other')),
  content_category    TEXT,
  fraud_score         INTEGER DEFAULT 0,
  payout_hold_days    INTEGER DEFAULT 7,
  total_clicks        BIGINT DEFAULT 0,
  total_leads         BIGINT DEFAULT 0,
  total_earned        NUMERIC(12,2) DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE social_accounts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id    UUID NOT NULL REFERENCES affiliate_profiles(id) ON DELETE CASCADE,
  platform        TEXT NOT NULL,
  handle          TEXT NOT NULL,
  profile_url     TEXT,
  followers       INTEGER,
  verified        BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE kyc_records (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id     UUID NOT NULL REFERENCES affiliate_profiles(id) ON DELETE CASCADE,
  pan_number       TEXT,
  pan_doc_path     TEXT,
  aadhaar_last4    TEXT,
  aadhaar_doc_path TEXT,
  bank_name        TEXT,
  account_number   TEXT,
  ifsc_code        TEXT,
  upi_id           TEXT,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified','rejected')),
  verified_at      TIMESTAMPTZ,
  verified_by      UUID REFERENCES users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CAMPAIGNS ───
CREATE TABLE campaigns (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  description         TEXT,
  destination_url     TEXT NOT NULL,
  whatsapp_number     TEXT NOT NULL,
  whatsapp_template   TEXT,
  status              TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','ended')),
  geo_allowlist       TEXT[],
  geo_blocklist       TEXT[],
  daily_lead_cap      INTEGER,
  total_lead_cap      INTEGER,
  payout_per_lead     NUMERIC(8,2) NOT NULL DEFAULT 25,
  content_payout_min  NUMERIC(8,2) DEFAULT 500,
  content_payout_max  NUMERIC(8,2) DEFAULT 5000,
  starts_at           TIMESTAMPTZ,
  ends_at             TIMESTAMPTZ,
  created_by          UUID REFERENCES users(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE commission_rules (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id     UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  tier            TEXT,
  rule_type       TEXT NOT NULL CHECK (rule_type IN ('flat','tiered','milestone','contest')),
  min_leads       INTEGER DEFAULT 0,
  max_leads       INTEGER,
  payout_amount   NUMERIC(8,2) NOT NULL,
  bonus_amount    NUMERIC(8,2) DEFAULT 0,
  description     TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE affiliate_links (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id    UUID NOT NULL REFERENCES affiliate_profiles(id) ON DELETE CASCADE,
  campaign_id     UUID NOT NULL REFERENCES campaigns(id),
  short_code      TEXT UNIQUE NOT NULL,
  full_url        TEXT NOT NULL,
  source_tag      TEXT,
  platform_tag    TEXT,
  city_tag        TEXT,
  language_tag    TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  total_clicks    BIGINT DEFAULT 0,
  total_leads     BIGINT DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TRACKING ───
CREATE TABLE clicks (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id             UUID NOT NULL REFERENCES affiliate_links(id),
  affiliate_id        UUID NOT NULL REFERENCES affiliate_profiles(id),
  campaign_id         UUID NOT NULL REFERENCES campaigns(id),
  session_id          TEXT NOT NULL UNIQUE,
  ip_hash             TEXT,
  device_type         TEXT,
  os                  TEXT,
  browser             TEXT,
  country             TEXT,
  state_region        TEXT,
  city                TEXT,
  referrer            TEXT,
  utm_source          TEXT,
  utm_medium          TEXT,
  utm_campaign        TEXT,
  landing_variant     TEXT,
  fingerprint_hash    TEXT,
  is_duplicate        BOOLEAN DEFAULT FALSE,
  is_vpn              BOOLEAN DEFAULT FALSE,
  is_bot              BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_clicks_session ON clicks(session_id);
CREATE INDEX idx_clicks_affiliate ON clicks(affiliate_id);
CREATE INDEX idx_clicks_campaign ON clicks(campaign_id);
CREATE INDEX idx_clicks_created ON clicks(created_at);

CREATE TABLE whatsapp_intents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  click_id        UUID REFERENCES clicks(id),
  session_id      TEXT NOT NULL,
  tracking_token  TEXT NOT NULL UNIQUE,
  campaign_id     UUID NOT NULL REFERENCES campaigns(id),
  affiliate_id    UUID NOT NULL REFERENCES affiliate_profiles(id),
  intent_type     TEXT DEFAULT 'click',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_wa_intents_token ON whatsapp_intents(tracking_token);
CREATE INDEX idx_wa_intents_session ON whatsapp_intents(session_id);

CREATE TABLE whatsapp_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  intent_id       UUID REFERENCES whatsapp_intents(id),
  tracking_token  TEXT,
  wa_message_id   TEXT UNIQUE,
  phone_hash      TEXT NOT NULL,
  phone_last4     TEXT,
  affiliate_id    UUID REFERENCES affiliate_profiles(id),
  campaign_id     UUID REFERENCES campaigns(id),
  raw_payload     JSONB,
  received_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_wa_messages_phone ON whatsapp_messages(phone_hash);
CREATE INDEX idx_wa_messages_token ON whatsapp_messages(tracking_token);

-- ─── LEADS ───
CREATE TABLE leads (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id        UUID NOT NULL REFERENCES affiliate_profiles(id),
  campaign_id         UUID NOT NULL REFERENCES campaigns(id),
  click_id            UUID REFERENCES clicks(id),
  wa_message_id       UUID REFERENCES whatsapp_messages(id),
  phone_hash          TEXT NOT NULL,
  phone_last4         TEXT,
  status              TEXT NOT NULL DEFAULT 'captured'
                      CHECK (status IN ('captured','wa_clicked','message_received','duplicate_check','qualified','hold','rejected','payable','paid')),
  fraud_score         INTEGER DEFAULT 0,
  is_duplicate        BOOLEAN DEFAULT FALSE,
  duplicate_of        UUID REFERENCES leads(id),
  geo_eligible        BOOLEAN DEFAULT TRUE,
  rejection_reason    TEXT,
  qualified_at        TIMESTAMPTZ,
  payable_at          TIMESTAMPTZ,
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_leads_phone_campaign ON leads(phone_hash, campaign_id) WHERE status != 'rejected';
CREATE INDEX idx_leads_affiliate ON leads(affiliate_id);
CREATE INDEX idx_leads_status ON leads(status);

CREATE TABLE lead_status_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id         UUID NOT NULL REFERENCES leads(id),
  from_status     TEXT,
  to_status       TEXT NOT NULL,
  changed_by      UUID REFERENCES users(id),
  reason          TEXT,
  metadata        JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── WALLET & PAYOUTS ───
CREATE TABLE wallets (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id        UUID NOT NULL UNIQUE REFERENCES affiliate_profiles(id),
  pending_balance     NUMERIC(12,2) DEFAULT 0,
  approved_balance    NUMERIC(12,2) DEFAULT 0,
  on_hold_balance     NUMERIC(12,2) DEFAULT 0,
  withdrawn_total     NUMERIC(12,2) DEFAULT 0,
  reversed_total      NUMERIC(12,2) DEFAULT 0,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE commission_ledger (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id        UUID NOT NULL REFERENCES affiliate_profiles(id),
  lead_id             UUID REFERENCES leads(id),
  campaign_id         UUID REFERENCES campaigns(id),
  entry_type          TEXT NOT NULL CHECK (entry_type IN ('lead_bonus','content_bonus','milestone_bonus','contest_bonus','manual_credit','reversal','hold','release')),
  amount              NUMERIC(10,2) NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','on_hold','reversed','paid')),
  hold_until          TIMESTAMPTZ,
  description         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ledger_affiliate ON commission_ledger(affiliate_id);
CREATE INDEX idx_ledger_status ON commission_ledger(status);

CREATE TABLE withdrawal_requests (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id        UUID NOT NULL REFERENCES affiliate_profiles(id),
  amount              NUMERIC(10,2) NOT NULL,
  method              TEXT NOT NULL CHECK (method IN ('upi','bank_transfer')),
  upi_id              TEXT,
  bank_account        TEXT,
  ifsc_code           TEXT,
  bank_name           TEXT,
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','processing','paid','failed','cancelled')),
  razorpayx_payout_id TEXT,
  failure_reason      TEXT,
  approved_by         UUID REFERENCES users(id),
  approved_at         TIMESTAMPTZ,
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payout_batches (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_ref       TEXT UNIQUE NOT NULL,
  total_amount    NUMERIC(12,2) NOT NULL,
  count           INTEGER NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','partial','failed')),
  initiated_by    UUID REFERENCES users(id),
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── FRAUD & COMPLIANCE ───
CREATE TABLE fraud_flags (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type     TEXT NOT NULL CHECK (entity_type IN ('click','lead','affiliate','withdrawal')),
  entity_id       UUID NOT NULL,
  flag_type       TEXT NOT NULL,
  severity        TEXT NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  description     TEXT,
  auto_actioned   BOOLEAN DEFAULT FALSE,
  reviewed_by     UUID REFERENCES users(id),
  reviewed_at     TIMESTAMPTZ,
  resolved        BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE blacklisted_phones (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_hash      TEXT NOT NULL UNIQUE,
  reason          TEXT,
  added_by        UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE geo_rules (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id     UUID REFERENCES campaigns(id),
  country_code    TEXT NOT NULL,
  state_region    TEXT,
  rule_type       TEXT NOT NULL CHECK (rule_type IN ('allow','block')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CREATIVES & CONTENT ───
CREATE TABLE creatives (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id     UUID REFERENCES campaigns(id),
  type            TEXT NOT NULL CHECK (type IN ('script','caption','hook','banner','thumbnail','disclaimer')),
  title           TEXT NOT NULL,
  content         TEXT,
  file_path       TEXT,
  language        TEXT DEFAULT 'en',
  is_active       BOOLEAN DEFAULT TRUE,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE content_submissions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id     UUID NOT NULL REFERENCES affiliate_profiles(id),
  campaign_id      UUID REFERENCES campaigns(id),
  platform         TEXT NOT NULL,
  post_url         TEXT NOT NULL,
  post_type        TEXT CHECK (post_type IN ('reel','post','story','video','thread')),
  views            INTEGER,
  likes            INTEGER,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  payout_amount    NUMERIC(8,2),
  reviewed_by      UUID REFERENCES users(id),
  rejection_reason TEXT,
  reviewed_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SUPPORT & AUDIT ───
CREATE TABLE support_tickets (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id    UUID REFERENCES affiliate_profiles(id),
  subject         TEXT NOT NULL,
  body            TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
  assigned_to     UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ticket_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id       UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(id),
  message         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id        UUID REFERENCES users(id),
  action          TEXT NOT NULL,
  entity_type     TEXT NOT NULL,
  entity_id       UUID,
  old_value       JSONB,
  new_value       JSONB,
  ip_address      TEXT,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- ─── TRIGGERS: updated_at ───
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_upd BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_affiliate_profiles_upd BEFORE UPDATE ON affiliate_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_kyc_upd BEFORE UPDATE ON kyc_records FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_campaigns_upd BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_leads_upd BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_wallets_upd BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_ledger_upd BEFORE UPDATE ON commission_ledger FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_withdrawal_upd BEFORE UPDATE ON withdrawal_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
