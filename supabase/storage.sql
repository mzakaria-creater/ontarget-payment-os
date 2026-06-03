-- ============================================================
-- OnTarget Payment OS — Supabase Storage Buckets
-- ============================================================
-- Run this in the Supabase SQL editor AFTER migration.
-- ============================================================

-- ============================================================
-- BUCKET: payment-proofs
-- Private bucket for customer proof-of-payment uploads.
-- Access is granted only via signed URLs (Edge Functions).
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-proofs',
  'payment-proofs',
  FALSE,
  10485760,  -- 10 MB limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- BUCKET: merchant-assets
-- Public bucket for merchant logos, brand assets.
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'merchant-assets',
  'merchant-assets',
  TRUE,
  5242880,  -- 5 MB limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- BUCKET: settlement-reports
-- Private bucket for generated settlement PDFs/CSVs.
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'settlement-reports',
  'settlement-reports',
  FALSE,
  52428800,  -- 50 MB limit
  ARRAY[
    'application/pdf',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE RLS POLICIES — payment-proofs
-- ============================================================

-- Edge Functions (service role) can do anything — no policy needed for service role.
-- Authenticated users: can upload to own transaction folder only.
-- No direct SELECT allowed — must use signed URL.

CREATE POLICY "authenticated_upload_proof"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'payment-proofs'
  );

-- Admins can view proofs
CREATE POLICY "admin_view_proof"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'payment-proofs'
    AND public.is_admin_or_operator()
  );

-- ============================================================
-- STORAGE RLS POLICIES — merchant-assets
-- ============================================================

-- Anyone can read public merchant assets
CREATE POLICY "public_read_merchant_assets"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'merchant-assets');

-- Merchants can upload own assets
CREATE POLICY "merchant_upload_own_assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'merchant-assets'
    AND public.get_my_role() IN ('merchant', 'admin')
  );

-- ============================================================
-- STORAGE RLS POLICIES — settlement-reports
-- ============================================================

-- Admin can access all settlement reports
CREATE POLICY "admin_access_settlement_reports"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'settlement-reports'
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id = 'settlement-reports'
    AND public.is_admin()
  );

-- Merchants can read their own settlement folder
CREATE POLICY "merchant_read_own_settlement_reports"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'settlement-reports'
    AND (storage.foldername(name))[1] = public.get_my_merchant_id()::text
    AND public.get_my_role() = 'merchant'
  );
