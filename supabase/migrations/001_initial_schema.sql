-- ============================================================
-- OnTarget Payment OS — Initial Schema Migration
-- Version: 1.0.0
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('admin', 'merchant', 'operator');
CREATE TYPE merchant_status AS ENUM ('active', 'paused', 'suspended');
CREATE TYPE payment_method_type AS ENUM ('wallet', 'bank', 'cash', 'crypto', 'card');
CREATE TYPE account_status AS ENUM ('active', 'paused', 'full');
CREATE TYPE transaction_type AS ENUM ('deposit', 'payout');
CREATE TYPE transaction_status AS ENUM (
  'created',
  'pending',
  'proof_uploaded',
  'under_review',
  'auto_matched',
  'approved',
  'declined',
  'expired',
  'cancelled'
);
CREATE TYPE raw_event_source AS ENUM ('sms', 'email', 'binance', 'manual', 'n8n');
CREATE TYPE raw_event_status AS ENUM ('received', 'parsed', 'matched', 'failed', 'duplicate');
CREATE TYPE fee_type AS ENUM ('percentage', 'fixed');
CREATE TYPE settlement_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE callback_status AS ENUM ('pending', 'sent', 'failed', 'retrying');
CREATE TYPE key_status AS ENUM ('active', 'revoked');
CREATE TYPE method_status AS ENUM ('active', 'inactive');
CREATE TYPE allocation_status AS ENUM ('reserved', 'confirmed', 'released');

-- ============================================================
-- TABLE: profiles
-- ============================================================

CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT,
  email           TEXT,
  role            user_role NOT NULL DEFAULT 'merchant',
  merchant_id     UUID,
  language        TEXT NOT NULL DEFAULT 'en',
  avatar_url      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

-- ============================================================
-- TABLE: merchants
-- ============================================================

CREATE TABLE public.merchants (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  code             TEXT NOT NULL,
  business_name    TEXT,
  contact_email    TEXT,
  contact_phone    TEXT,
  status           merchant_status NOT NULL DEFAULT 'active',
  default_currency TEXT NOT NULL DEFAULT 'EGP',
  callback_url     TEXT,
  success_url      TEXT,
  fail_url         TEXT,
  webhook_secret   TEXT DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (code)
);

-- ============================================================
-- TABLE: merchant_api_keys
-- ============================================================

CREATE TABLE public.merchant_api_keys (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id  UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  key_prefix   TEXT NOT NULL,
  key_hash     TEXT NOT NULL,
  label        TEXT,
  status       key_status NOT NULL DEFAULT 'active',
  last_used_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: payment_methods
-- ============================================================

CREATE TABLE public.payment_methods (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  name_ar    TEXT,
  code       TEXT NOT NULL,
  country    TEXT NOT NULL DEFAULT 'EG',
  currency   TEXT NOT NULL DEFAULT 'EGP',
  type       payment_method_type NOT NULL DEFAULT 'wallet',
  status     method_status NOT NULL DEFAULT 'active',
  min_amount NUMERIC(18,2) NOT NULL DEFAULT 10,
  max_amount NUMERIC(18,2) NOT NULL DEFAULT 100000,
  icon_url   TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (code)
);

-- ============================================================
-- TABLE: payment_accounts
-- ============================================================

CREATE TABLE public.payment_accounts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method_id             UUID NOT NULL REFERENCES public.payment_methods(id),
  provider              TEXT NOT NULL,
  account_number        TEXT NOT NULL,
  account_name          TEXT NOT NULL,
  label                 TEXT,
  country               TEXT NOT NULL DEFAULT 'EG',
  currency              TEXT NOT NULL DEFAULT 'EGP',
  daily_limit           NUMERIC(18,2) NOT NULL DEFAULT 50000,
  used_today            NUMERIC(18,2) NOT NULL DEFAULT 0,
  min_amount            NUMERIC(18,2) NOT NULL DEFAULT 10,
  max_amount            NUMERIC(18,2) NOT NULL DEFAULT 10000,
  priority              INT NOT NULL DEFAULT 1,
  status                account_status NOT NULL DEFAULT 'active',
  assigned_merchant_ids UUID[] DEFAULT '{}',
  notes                 TEXT,
  reset_at              TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: transactions
-- ============================================================

CREATE TABLE public.transactions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id      TEXT NOT NULL,
  merchant_id         UUID NOT NULL REFERENCES public.merchants(id),
  merchant_order_id   TEXT,
  checkout_token      TEXT NOT NULL,
  customer_name       TEXT,
  customer_phone      TEXT,
  amount              NUMERIC(18,2) NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'EGP',
  type                transaction_type NOT NULL DEFAULT 'deposit',
  method_code         TEXT NOT NULL,
  assigned_account_id UUID REFERENCES public.payment_accounts(id),
  sender_name         TEXT,
  sender_phone        TEXT,
  transfer_reference  TEXT,
  proof_url           TEXT,
  status              transaction_status NOT NULL DEFAULT 'created',
  fees                NUMERIC(18,2) NOT NULL DEFAULT 0,
  net_amount          NUMERIC(18,2),
  callback_url        TEXT,
  success_url         TEXT,
  fail_url            TEXT,
  decline_reason      TEXT,
  ip_address          TEXT,
  expires_at          TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 minutes'),
  approved_by         UUID,
  approved_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (transaction_id),
  UNIQUE (checkout_token),
  UNIQUE (merchant_id, merchant_order_id)
);

-- ============================================================
-- TABLE: transaction_events
-- ============================================================

CREATE TABLE public.transaction_events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  old_status     transaction_status,
  new_status     transaction_status NOT NULL,
  note           TEXT,
  created_by     UUID,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: raw_events
-- ============================================================

CREATE TABLE public.raw_events (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source                 raw_event_source NOT NULL,
  provider               TEXT,
  raw_payload            JSONB NOT NULL DEFAULT '{}',
  parsed_payload         JSONB DEFAULT '{}',
  matched_transaction_id UUID REFERENCES public.transactions(id),
  status                 raw_event_status NOT NULL DEFAULT 'received',
  error_message          TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: wallet_allocations
-- ============================================================

CREATE TABLE public.wallet_allocations (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id     UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  payment_account_id UUID NOT NULL REFERENCES public.payment_accounts(id),
  amount             NUMERIC(18,2) NOT NULL,
  status             allocation_status NOT NULL DEFAULT 'reserved',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: settlements
-- ============================================================

CREATE TABLE public.settlements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id   UUID NOT NULL REFERENCES public.merchants(id),
  period_start  DATE NOT NULL,
  period_end    DATE NOT NULL,
  gross_amount  NUMERIC(18,2) NOT NULL DEFAULT 0,
  fees_amount   NUMERIC(18,2) NOT NULL DEFAULT 0,
  net_amount    NUMERIC(18,2) NOT NULL DEFAULT 0,
  currency      TEXT NOT NULL DEFAULT 'EGP',
  status        settlement_status NOT NULL DEFAULT 'pending',
  notes         TEXT,
  created_by    UUID,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: settlement_items
-- ============================================================

CREATE TABLE public.settlement_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settlement_id UUID NOT NULL REFERENCES public.settlements(id) ON DELETE CASCADE,
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  amount        NUMERIC(18,2) NOT NULL,
  fee           NUMERIC(18,2) NOT NULL DEFAULT 0,
  net           NUMERIC(18,2) NOT NULL
);

-- ============================================================
-- TABLE: callbacks
-- ============================================================

CREATE TABLE public.callbacks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id  UUID NOT NULL REFERENCES public.transactions(id),
  merchant_id     UUID NOT NULL REFERENCES public.merchants(id),
  url             TEXT NOT NULL,
  payload         JSONB NOT NULL DEFAULT '{}',
  response_status INT,
  response_body   TEXT,
  status          callback_status NOT NULL DEFAULT 'pending',
  retry_count     INT NOT NULL DEFAULT 0,
  next_retry_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: audit_logs
-- ============================================================

CREATE TABLE public.audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID,
  action      TEXT NOT NULL,
  table_name  TEXT NOT NULL,
  record_id   UUID NOT NULL,
  old_data    JSONB DEFAULT '{}',
  new_data    JSONB DEFAULT '{}',
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: fees_rules
-- ============================================================

CREATE TABLE public.fees_rules (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id      UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
  method_code      TEXT,
  transaction_type transaction_type,
  fee_type         fee_type NOT NULL DEFAULT 'percentage',
  fee_value        NUMERIC(10,4) NOT NULL DEFAULT 0,
  min_fee          NUMERIC(18,2) NOT NULL DEFAULT 0,
  max_fee          NUMERIC(18,2),
  status           method_status NOT NULL DEFAULT 'active',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: notifications
-- ============================================================

CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  title_ar    TEXT,
  body        TEXT NOT NULL,
  body_ar     TEXT,
  type        TEXT NOT NULL DEFAULT 'info',
  metadata    JSONB DEFAULT '{}',
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- profiles
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_merchant_id ON public.profiles(merchant_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- merchants
CREATE INDEX idx_merchants_status ON public.merchants(status);
CREATE INDEX idx_merchants_code ON public.merchants(code);

-- merchant_api_keys
CREATE INDEX idx_api_keys_merchant_id ON public.merchant_api_keys(merchant_id);
CREATE INDEX idx_api_keys_prefix ON public.merchant_api_keys(key_prefix);
CREATE INDEX idx_api_keys_status ON public.merchant_api_keys(status);

-- payment_methods
CREATE INDEX idx_payment_methods_code ON public.payment_methods(code);
CREATE INDEX idx_payment_methods_status ON public.payment_methods(status);

-- payment_accounts
CREATE INDEX idx_payment_accounts_method_id ON public.payment_accounts(method_id);
CREATE INDEX idx_payment_accounts_status ON public.payment_accounts(status);
CREATE INDEX idx_payment_accounts_currency ON public.payment_accounts(currency);
CREATE INDEX idx_payment_accounts_priority ON public.payment_accounts(priority);

-- transactions
CREATE INDEX idx_transactions_merchant_id ON public.transactions(merchant_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_checkout_token ON public.transactions(checkout_token);
CREATE INDEX idx_transactions_transaction_id ON public.transactions(transaction_id);
CREATE INDEX idx_transactions_merchant_order ON public.transactions(merchant_id, merchant_order_id);
CREATE INDEX idx_transactions_assigned_account ON public.transactions(assigned_account_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_transactions_expires_at ON public.transactions(expires_at);

-- transaction_events
CREATE INDEX idx_tx_events_transaction_id ON public.transaction_events(transaction_id);
CREATE INDEX idx_tx_events_created_at ON public.transaction_events(created_at DESC);

-- raw_events
CREATE INDEX idx_raw_events_source ON public.raw_events(source);
CREATE INDEX idx_raw_events_status ON public.raw_events(status);
CREATE INDEX idx_raw_events_matched_tx ON public.raw_events(matched_transaction_id);
CREATE INDEX idx_raw_events_created_at ON public.raw_events(created_at DESC);

-- wallet_allocations
CREATE INDEX idx_wallet_alloc_transaction_id ON public.wallet_allocations(transaction_id);
CREATE INDEX idx_wallet_alloc_account_id ON public.wallet_allocations(payment_account_id);

-- settlements
CREATE INDEX idx_settlements_merchant_id ON public.settlements(merchant_id);
CREATE INDEX idx_settlements_status ON public.settlements(status);
CREATE INDEX idx_settlements_period ON public.settlements(period_start, period_end);

-- settlement_items
CREATE INDEX idx_settlement_items_settlement_id ON public.settlement_items(settlement_id);
CREATE INDEX idx_settlement_items_transaction_id ON public.settlement_items(transaction_id);

-- callbacks
CREATE INDEX idx_callbacks_transaction_id ON public.callbacks(transaction_id);
CREATE INDEX idx_callbacks_merchant_id ON public.callbacks(merchant_id);
CREATE INDEX idx_callbacks_status ON public.callbacks(status);
CREATE INDEX idx_callbacks_next_retry ON public.callbacks(next_retry_at) WHERE status = 'retrying';

-- audit_logs
CREATE INDEX idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- fees_rules
CREATE INDEX idx_fees_rules_merchant_id ON public.fees_rules(merchant_id);
CREATE INDEX idx_fees_rules_method_code ON public.fees_rules(method_code);

-- notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_merchant_id ON public.notifications(merchant_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create profile on user sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate unique transaction ID
CREATE OR REPLACE FUNCTION public.generate_transaction_id()
RETURNS TEXT AS $$
DECLARE
  v_id TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    v_id := 'TXN-' || UPPER(encode(gen_random_bytes(6), 'hex'));
    SELECT EXISTS(SELECT 1 FROM public.transactions WHERE transaction_id = v_id) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Generate secure checkout token
CREATE OR REPLACE FUNCTION public.generate_checkout_token()
RETURNS TEXT AS $$
DECLARE
  v_token TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    v_token := encode(gen_random_bytes(24), 'base64');
    v_token := REPLACE(REPLACE(REPLACE(v_token, '+', '-'), '/', '_'), '=', '');
    SELECT EXISTS(SELECT 1 FROM public.transactions WHERE checkout_token = v_token) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  RETURN v_token;
END;
$$ LANGUAGE plpgsql;

-- Hash an API key (SHA256)
CREATE OR REPLACE FUNCTION public.hash_api_key(p_key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(p_key, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- updated_at triggers
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_merchants_updated_at
  BEFORE UPDATE ON public.merchants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_payment_accounts_updated_at
  BEFORE UPDATE ON public.payment_accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_wallet_alloc_updated_at
  BEFORE UPDATE ON public.wallet_allocations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_settlements_updated_at
  BEFORE UPDATE ON public.settlements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_callbacks_updated_at
  BEFORE UPDATE ON public.callbacks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_fees_rules_updated_at
  BEFORE UPDATE ON public.fees_rules
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile trigger
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY — ENABLE ON ALL TABLES
-- ============================================================

ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_api_keys   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_accounts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_events          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_allocations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.callbacks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees_rules          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications       ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER: get current user role
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_my_merchant_id()
RETURNS UUID AS $$
  SELECT merchant_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin_or_operator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role IN ('admin', 'operator')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- RLS POLICIES — profiles
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- User: can read and update own profile
CREATE POLICY "user_own_profile_select"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "user_own_profile_update"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- RLS POLICIES — merchants
-- ============================================================

CREATE POLICY "admin_all_merchants"
  ON public.merchants FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "merchant_own_select"
  ON public.merchants FOR SELECT
  TO authenticated
  USING (id = public.get_my_merchant_id());

CREATE POLICY "merchant_own_update"
  ON public.merchants FOR UPDATE
  TO authenticated
  USING (id = public.get_my_merchant_id() AND public.get_my_role() = 'merchant')
  WITH CHECK (id = public.get_my_merchant_id());

-- ============================================================
-- RLS POLICIES — merchant_api_keys
-- ============================================================

CREATE POLICY "admin_all_api_keys"
  ON public.merchant_api_keys FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Merchant: can see own keys (prefix only enforced at application layer)
CREATE POLICY "merchant_own_api_keys_select"
  ON public.merchant_api_keys FOR SELECT
  TO authenticated
  USING (merchant_id = public.get_my_merchant_id() AND public.get_my_role() = 'merchant');

CREATE POLICY "merchant_own_api_keys_insert"
  ON public.merchant_api_keys FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id = public.get_my_merchant_id() AND public.get_my_role() = 'merchant');

CREATE POLICY "merchant_own_api_keys_update"
  ON public.merchant_api_keys FOR UPDATE
  TO authenticated
  USING (merchant_id = public.get_my_merchant_id() AND public.get_my_role() = 'merchant');

-- ============================================================
-- RLS POLICIES — payment_methods
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_payment_methods"
  ON public.payment_methods FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Authenticated users: read active methods
CREATE POLICY "authenticated_read_active_methods"
  ON public.payment_methods FOR SELECT
  TO authenticated
  USING (status = 'active');

-- ============================================================
-- RLS POLICIES — payment_accounts
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_payment_accounts"
  ON public.payment_accounts FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- No other role can read payment accounts directly
-- (Wallet details are returned via Edge Functions only)

-- ============================================================
-- RLS POLICIES — transactions
-- ============================================================

CREATE POLICY "admin_all_transactions"
  ON public.transactions FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "merchant_own_transactions_select"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (merchant_id = public.get_my_merchant_id() AND public.get_my_role() = 'merchant');

-- Merchants cannot insert or approve directly (done via Edge Functions)

-- ============================================================
-- RLS POLICIES — transaction_events
-- ============================================================

CREATE POLICY "admin_all_tx_events"
  ON public.transaction_events FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "merchant_own_tx_events_select"
  ON public.transaction_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.transactions t
      WHERE t.id = transaction_id
      AND t.merchant_id = public.get_my_merchant_id()
    )
    AND public.get_my_role() = 'merchant'
  );

-- ============================================================
-- RLS POLICIES — raw_events
-- ============================================================

CREATE POLICY "admin_all_raw_events"
  ON public.raw_events FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

-- No merchant access to raw events

-- ============================================================
-- RLS POLICIES — wallet_allocations
-- ============================================================

CREATE POLICY "admin_all_wallet_allocations"
  ON public.wallet_allocations FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- RLS POLICIES — settlements
-- ============================================================

CREATE POLICY "admin_all_settlements"
  ON public.settlements FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "merchant_own_settlements_select"
  ON public.settlements FOR SELECT
  TO authenticated
  USING (merchant_id = public.get_my_merchant_id() AND public.get_my_role() = 'merchant');

-- ============================================================
-- RLS POLICIES — settlement_items
-- ============================================================

CREATE POLICY "admin_all_settlement_items"
  ON public.settlement_items FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "merchant_own_settlement_items_select"
  ON public.settlement_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.settlements s
      WHERE s.id = settlement_id
      AND s.merchant_id = public.get_my_merchant_id()
    )
    AND public.get_my_role() = 'merchant'
  );

-- ============================================================
-- RLS POLICIES — callbacks
-- ============================================================

CREATE POLICY "admin_all_callbacks"
  ON public.callbacks FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "merchant_own_callbacks_select"
  ON public.callbacks FOR SELECT
  TO authenticated
  USING (merchant_id = public.get_my_merchant_id() AND public.get_my_role() = 'merchant');

-- ============================================================
-- RLS POLICIES — audit_logs
-- ============================================================

CREATE POLICY "admin_all_audit_logs"
  ON public.audit_logs FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- No merchant or operator access to raw audit logs

-- ============================================================
-- RLS POLICIES — fees_rules
-- ============================================================

CREATE POLICY "admin_all_fees_rules"
  ON public.fees_rules FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "merchant_own_fees_select"
  ON public.fees_rules FOR SELECT
  TO authenticated
  USING (
    (merchant_id = public.get_my_merchant_id() OR merchant_id IS NULL)
    AND public.get_my_role() = 'merchant'
  );

-- ============================================================
-- RLS POLICIES — notifications
-- ============================================================

CREATE POLICY "admin_all_notifications"
  ON public.notifications FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "user_own_notifications_select"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "user_own_notifications_update"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "merchant_own_notifications_select"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (merchant_id = public.get_my_merchant_id() AND public.get_my_role() = 'merchant');
