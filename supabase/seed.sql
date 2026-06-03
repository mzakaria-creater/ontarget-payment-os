-- ============================================================
-- OnTarget Payment OS — Seed / Demo Data
-- ============================================================
-- Run AFTER migration. Creates demo admin, merchants, methods,
-- accounts, transactions, and sample events.
-- ============================================================

-- ============================================================
-- 1. PAYMENT METHODS
-- ============================================================

INSERT INTO public.payment_methods (id, name, name_ar, code, country, currency, type, status, min_amount, max_amount, sort_order) VALUES
  ('11111111-0001-0001-0001-000000000001', 'Vodafone Cash',   'فودافون كاش',    'vodafone_cash',  'EG', 'EGP', 'wallet', 'active', 10,    50000, 1),
  ('11111111-0001-0001-0001-000000000002', 'Orange Cash',     'أورنج كاش',      'orange_cash',    'EG', 'EGP', 'wallet', 'active', 10,    50000, 2),
  ('11111111-0001-0001-0001-000000000003', 'Etisalat Cash',   'اتصالات كاش',    'etisalat_cash',  'EG', 'EGP', 'wallet', 'active', 10,    50000, 3),
  ('11111111-0001-0001-0001-000000000004', 'WE Pay',          'وي باي',         'we_pay',         'EG', 'EGP', 'wallet', 'active', 10,    50000, 4),
  ('11111111-0001-0001-0001-000000000005', 'InstaPay',        'إنستاباي',       'instapay',       'EG', 'EGP', 'wallet', 'active', 10,   100000, 5),
  ('11111111-0001-0001-0001-000000000006', 'Bank Transfer',   'تحويل بنكي',     'bank_transfer',  'EG', 'EGP', 'bank',   'active', 500,  500000, 6),
  ('11111111-0001-0001-0001-000000000007', 'Fawry',           'فوري',           'fawry',          'EG', 'EGP', 'cash',   'active', 20,    20000, 7),
  ('11111111-0001-0001-0001-000000000008', 'Meeza Card',      'ميزة',           'meeza',          'EG', 'EGP', 'card',   'active', 100,   50000, 8),
  ('11111111-0001-0001-0001-000000000009', 'PayPal',          'باي بال',        'paypal',         'US', 'USD', 'wallet', 'active', 5,     10000, 9),
  ('11111111-0001-0001-0001-000000000010', 'Wise',            'وايز',           'wise',           'GB', 'USD', 'wallet', 'active', 5,     50000, 10),
  ('11111111-0001-0001-0001-000000000011', 'Revolut',         'ريفولوت',        'revolut',        'GB', 'EUR', 'wallet', 'active', 5,     50000, 11),
  ('11111111-0001-0001-0001-000000000012', 'USDT (TRC20)',    'USDT تيثر',      'usdt_trc20',     'GL', 'USDT','crypto', 'active', 10,   100000, 12),
  ('11111111-0001-0001-0001-000000000013', 'USDT (ERC20)',    'USDT إيثريوم',   'usdt_erc20',     'GL', 'USDT','crypto', 'active', 10,   100000, 13);

-- ============================================================
-- 2. DEMO MERCHANTS
-- ============================================================

INSERT INTO public.merchants (id, name, code, business_name, contact_email, contact_phone, status, default_currency, callback_url, success_url, fail_url, webhook_secret) VALUES
  (
    '22222222-0001-0001-0001-000000000001',
    'Demo Store',
    'DEMO001',
    'Demo Store LLC',
    'merchant@demo.com',
    '01000000001',
    'active',
    'EGP',
    'https://demo.example.com/callback',
    'https://demo.example.com/success',
    'https://demo.example.com/fail',
    'whs_demo_secret_key_001'
  ),
  (
    '22222222-0001-0001-0001-000000000002',
    'Tech Shop',
    'TECH002',
    'Tech Shop Egypt',
    'tech@shop.com',
    '01100000002',
    'active',
    'EGP',
    'https://techshop.example.com/callback',
    'https://techshop.example.com/success',
    'https://techshop.example.com/fail',
    'whs_tech_secret_key_002'
  ),
  (
    '22222222-0001-0001-0001-000000000003',
    'Paused Merchant',
    'PAUSE003',
    'Paused Co.',
    'paused@merchant.com',
    '01200000003',
    'paused',
    'EGP',
    NULL, NULL, NULL,
    'whs_paused_secret_003'
  );

-- ============================================================
-- 3. DEMO API KEYS
-- (key_hash = sha256 of 'demo_api_key_live_001' etc)
-- Actual key: ontarget_live_demo_api_key_001
-- ============================================================

INSERT INTO public.merchant_api_keys (id, merchant_id, key_prefix, key_hash, label, status) VALUES
  (
    '33333333-0001-0001-0001-000000000001',
    '22222222-0001-0001-0001-000000000001',
    'ontarget_live_demo',
    encode(digest('ontarget_live_demo_api_key_001', 'sha256'), 'hex'),
    'Live Key',
    'active'
  ),
  (
    '33333333-0001-0001-0001-000000000002',
    '22222222-0001-0001-0001-000000000002',
    'ontarget_live_tech',
    encode(digest('ontarget_live_tech_api_key_002', 'sha256'), 'hex'),
    'Production Key',
    'active'
  );

-- ============================================================
-- 4. PAYMENT ACCOUNTS (WALLETS)
-- ============================================================

INSERT INTO public.payment_accounts (
  id, method_id, provider, account_number, account_name, label,
  country, currency, daily_limit, used_today, min_amount, max_amount,
  priority, status, assigned_merchant_ids
) VALUES
  (
    '44444444-0001-0001-0001-000000000001',
    '11111111-0001-0001-0001-000000000001',
    'Vodafone Cash', '01001111111', 'محمد أحمد', 'VF Main Wallet',
    'EG', 'EGP', 50000, 0, 100, 10000, 1, 'active',
    ARRAY['22222222-0001-0001-0001-000000000001'::UUID, '22222222-0001-0001-0001-000000000002'::UUID]
  ),
  (
    '44444444-0001-0001-0001-000000000002',
    '11111111-0001-0001-0001-000000000001',
    'Vodafone Cash', '01002222222', 'أحمد خالد', 'VF Backup Wallet',
    'EG', 'EGP', 30000, 0, 50, 5000, 2, 'active',
    ARRAY['22222222-0001-0001-0001-000000000001'::UUID]
  ),
  (
    '44444444-0001-0001-0001-000000000003',
    '11111111-0001-0001-0001-000000000002',
    'Orange Cash', '01201333333', 'سارة محمود', 'Orange Main',
    'EG', 'EGP', 40000, 0, 50, 8000, 1, 'active',
    ARRAY['22222222-0001-0001-0001-000000000001'::UUID, '22222222-0001-0001-0001-000000000002'::UUID]
  ),
  (
    '44444444-0001-0001-0001-000000000004',
    '11111111-0001-0001-0001-000000000005',
    'InstaPay', '01005444444', 'علي حسن', 'InstaPay Primary',
    'EG', 'EGP', 100000, 0, 100, 20000, 1, 'active',
    ARRAY['22222222-0001-0001-0001-000000000001'::UUID]
  ),
  (
    '44444444-0001-0001-0001-000000000005',
    '11111111-0001-0001-0001-000000000006',
    'CIB Bank', 'EG380001200100030040810503', 'OnTarget Payments', 'CIB Settlement',
    'EG', 'EGP', 500000, 0, 500, 100000, 1, 'active',
    ARRAY[]::UUID[]
  ),
  (
    '44444444-0001-0001-0001-000000000006',
    '11111111-0001-0001-0001-000000000012',
    'Binance', 'TRX_wallet_address_example_123', 'OnTarget Crypto', 'USDT TRC20 Main',
    'GL', 'USDT', 100000, 0, 10, 50000, 1, 'active',
    ARRAY[]::UUID[]
  );

-- ============================================================
-- 5. FEES RULES
-- ============================================================

-- Global default fee: 2% for deposits
INSERT INTO public.fees_rules (merchant_id, method_code, transaction_type, fee_type, fee_value, min_fee, max_fee, status) VALUES
  (NULL, NULL, 'deposit', 'percentage', 2.0000, 5.00, 500.00, 'active'),
  (NULL, NULL, 'payout',  'percentage', 1.5000, 5.00, 300.00, 'active');

-- Demo Store custom fee: 1.5% deposits, 1% payouts
INSERT INTO public.fees_rules (merchant_id, method_code, transaction_type, fee_type, fee_value, min_fee, max_fee, status) VALUES
  ('22222222-0001-0001-0001-000000000001', NULL, 'deposit', 'percentage', 1.5000, 3.00, 250.00, 'active'),
  ('22222222-0001-0001-0001-000000000001', NULL, 'payout',  'percentage', 1.0000, 3.00, 150.00, 'active');

-- Crypto fixed fee
INSERT INTO public.fees_rules (merchant_id, method_code, transaction_type, fee_type, fee_value, min_fee, max_fee, status) VALUES
  (NULL, 'usdt_trc20', 'deposit', 'fixed', 2.0000, 2.00, NULL, 'active'),
  (NULL, 'usdt_erc20', 'deposit', 'fixed', 5.0000, 5.00, NULL, 'active');

-- ============================================================
-- 6. DEMO TRANSACTIONS
-- ============================================================

-- Transaction 1: Approved deposit for Demo Store
INSERT INTO public.transactions (
  id, transaction_id, merchant_id, merchant_order_id, checkout_token,
  customer_name, customer_phone, amount, currency, type, method_code,
  assigned_account_id, sender_name, sender_phone, transfer_reference,
  status, fees, net_amount, expires_at, approved_at
) VALUES (
  '55555555-0001-0001-0001-000000000001',
  'TXN-DEMO0001',
  '22222222-0001-0001-0001-000000000001',
  'ORD-1001',
  'demo_token_checkout_001',
  'Ahmed Mohamed', '01000000001',
  5000.00, 'EGP', 'deposit', 'vodafone_cash',
  '44444444-0001-0001-0001-000000000001',
  'Ahmed Mohamed', '01000000001', 'VF-REF-001',
  'approved', 75.00, 4925.00,
  NOW() + INTERVAL '1 hour', NOW() - INTERVAL '1 hour'
);

-- Transaction 2: Under review
INSERT INTO public.transactions (
  id, transaction_id, merchant_id, merchant_order_id, checkout_token,
  customer_name, customer_phone, amount, currency, type, method_code,
  assigned_account_id, sender_name, sender_phone, transfer_reference,
  status, fees, net_amount, expires_at
) VALUES (
  '55555555-0001-0001-0001-000000000002',
  'TXN-DEMO0002',
  '22222222-0001-0001-0001-000000000001',
  'ORD-1002',
  'demo_token_checkout_002',
  'Sara Ahmed', '01100000002',
  2500.00, 'EGP', 'deposit', 'orange_cash',
  '44444444-0001-0001-0001-000000000003',
  'Sara Ahmed', '01100000002', 'OR-REF-002',
  'under_review', 37.50, 2462.50,
  NOW() + INTERVAL '25 minutes'
);

-- Transaction 3: Created (not yet assigned)
INSERT INTO public.transactions (
  id, transaction_id, merchant_id, merchant_order_id, checkout_token,
  customer_name, customer_phone, amount, currency, type, method_code,
  status, fees, net_amount, expires_at
) VALUES (
  '55555555-0001-0001-0001-000000000003',
  'TXN-DEMO0003',
  '22222222-0001-0001-0001-000000000002',
  'ORD-2001',
  'demo_token_checkout_003',
  'Omar Hassan', '01200000003',
  10000.00, 'EGP', 'deposit', 'instapay',
  'created', 0, NULL,
  NOW() + INTERVAL '30 minutes'
);

-- Transaction 4: Declined
INSERT INTO public.transactions (
  id, transaction_id, merchant_id, merchant_order_id, checkout_token,
  customer_name, customer_phone, amount, currency, type, method_code,
  assigned_account_id, status, fees, net_amount, decline_reason, expires_at
) VALUES (
  '55555555-0001-0001-0001-000000000004',
  'TXN-DEMO0004',
  '22222222-0001-0001-0001-000000000001',
  'ORD-1003',
  'demo_token_checkout_004',
  'Mona Ali', '01300000004',
  1000.00, 'EGP', 'deposit', 'vodafone_cash',
  '44444444-0001-0001-0001-000000000001',
  'declined', 0, NULL,
  'Transfer reference not matching',
  NOW() - INTERVAL '2 hours'
);

-- Transaction 5: Expired
INSERT INTO public.transactions (
  id, transaction_id, merchant_id, merchant_order_id, checkout_token,
  customer_name, customer_phone, amount, currency, type, method_code,
  status, fees, net_amount, expires_at
) VALUES (
  '55555555-0001-0001-0001-000000000005',
  'TXN-DEMO0005',
  '22222222-0001-0001-0001-000000000002',
  'ORD-2002',
  'demo_token_checkout_005',
  'Youssef Khaled', '01400000005',
  3000.00, 'EGP', 'deposit', 'we_pay',
  'expired', 0, NULL,
  NOW() - INTERVAL '1 hour'
);

-- ============================================================
-- 7. TRANSACTION EVENTS (history for demo transactions)
-- ============================================================

INSERT INTO public.transaction_events (transaction_id, old_status, new_status, note) VALUES
  ('55555555-0001-0001-0001-000000000001', NULL,             'created',      'Payment initiated by merchant API'),
  ('55555555-0001-0001-0001-000000000001', 'created',        'pending',      'Wallet assigned, awaiting payment'),
  ('55555555-0001-0001-0001-000000000001', 'pending',        'proof_uploaded','Customer uploaded transfer proof'),
  ('55555555-0001-0001-0001-000000000001', 'proof_uploaded', 'under_review', 'Sent to admin queue'),
  ('55555555-0001-0001-0001-000000000001', 'under_review',   'approved',     'Admin verified and approved'),
  ('55555555-0001-0001-0001-000000000002', NULL,             'created',      'Payment initiated'),
  ('55555555-0001-0001-0001-000000000002', 'created',        'pending',      'Wallet assigned'),
  ('55555555-0001-0001-0001-000000000002', 'pending',        'proof_uploaded','Proof submitted'),
  ('55555555-0001-0001-0001-000000000002', 'proof_uploaded', 'under_review', 'Queued for admin review'),
  ('55555555-0001-0001-0001-000000000004', NULL,             'created',      'Payment initiated'),
  ('55555555-0001-0001-0001-000000000004', 'created',        'pending',      'Wallet assigned'),
  ('55555555-0001-0001-0001-000000000004', 'pending',        'declined',     'Transfer reference not matching');

-- ============================================================
-- 8. WALLET ALLOCATIONS
-- ============================================================

INSERT INTO public.wallet_allocations (transaction_id, payment_account_id, amount, status) VALUES
  ('55555555-0001-0001-0001-000000000001', '44444444-0001-0001-0001-000000000001', 5000.00, 'confirmed'),
  ('55555555-0001-0001-0001-000000000002', '44444444-0001-0001-0001-000000000003', 2500.00, 'reserved'),
  ('55555555-0001-0001-0001-000000000004', '44444444-0001-0001-0001-000000000001', 1000.00, 'released');

-- ============================================================
-- 9. RAW EVENTS (sample SMS/n8n events)
-- ============================================================

INSERT INTO public.raw_events (source, provider, raw_payload, parsed_payload, matched_transaction_id, status) VALUES
  (
    'sms', 'Vodafone Cash',
    '{"from": "Vodafone Cash", "message": "تم استلام 5000 جنيه من 01000000001. رقم العملية VF-REF-001", "device": "Samsung A24", "received_at": "2026-06-03T10:00:00"}',
    '{"amount": 5000, "currency": "EGP", "sender_phone": "01000000001", "reference": "VF-REF-001", "provider": "Vodafone Cash"}',
    '55555555-0001-0001-0001-000000000001',
    'matched'
  ),
  (
    'sms', 'Orange Cash',
    '{"from": "Orange Cash", "message": "استلمت 2500 جنيه من 01100000002 مرجع OR-REF-002", "device": "iPhone 15", "received_at": "2026-06-03T11:30:00"}',
    '{"amount": 2500, "currency": "EGP", "sender_phone": "01100000002", "reference": "OR-REF-002", "provider": "Orange Cash"}',
    '55555555-0001-0001-0001-000000000002',
    'matched'
  ),
  (
    'n8n', 'webhook',
    '{"event": "payment.received", "amount": 500, "currency": "EGP", "sender": "unknown_01500000005", "timestamp": "2026-06-03T12:00:00"}',
    '{"amount": 500, "currency": "EGP", "sender_phone": "01500000005", "provider": "n8n"}',
    NULL,
    'failed'
  );

-- ============================================================
-- 10. SAMPLE SETTLEMENT
-- ============================================================

INSERT INTO public.settlements (
  id, merchant_id, period_start, period_end,
  gross_amount, fees_amount, net_amount, currency, status
) VALUES (
  '66666666-0001-0001-0001-000000000001',
  '22222222-0001-0001-0001-000000000001',
  '2026-06-01', '2026-06-03',
  5000.00, 75.00, 4925.00,
  'EGP', 'completed'
);

INSERT INTO public.settlement_items (settlement_id, transaction_id, amount, fee, net) VALUES
  (
    '66666666-0001-0001-0001-000000000001',
    '55555555-0001-0001-0001-000000000001',
    5000.00, 75.00, 4925.00
  );

-- ============================================================
-- 11. SAMPLE CALLBACKS
-- ============================================================

INSERT INTO public.callbacks (transaction_id, merchant_id, url, payload, response_status, response_body, status, retry_count) VALUES
  (
    '55555555-0001-0001-0001-000000000001',
    '22222222-0001-0001-0001-000000000001',
    'https://demo.example.com/callback',
    '{"transaction_id": "TXN-DEMO0001", "status": "approved", "amount": 5000, "currency": "EGP"}',
    200,
    '{"received": true}',
    'sent',
    0
  ),
  (
    '55555555-0001-0001-0001-000000000004',
    '22222222-0001-0001-0001-000000000001',
    'https://demo.example.com/callback',
    '{"transaction_id": "TXN-DEMO0004", "status": "declined", "amount": 1000, "currency": "EGP"}',
    200,
    '{"received": true}',
    'sent',
    0
  );

-- ============================================================
-- 12. AUDIT LOG SAMPLES
-- ============================================================

INSERT INTO public.audit_logs (action, table_name, record_id, old_data, new_data, ip_address) VALUES
  (
    'transaction.approved',
    'transactions',
    '55555555-0001-0001-0001-000000000001',
    '{"status": "under_review"}',
    '{"status": "approved", "approved_at": "2026-06-03T10:05:00Z"}',
    '127.0.0.1'
  ),
  (
    'transaction.declined',
    'transactions',
    '55555555-0001-0001-0001-000000000004',
    '{"status": "pending"}',
    '{"status": "declined", "decline_reason": "Transfer reference not matching"}',
    '127.0.0.1'
  );
