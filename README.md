# OnTarget Payment OS — Phase 1: Backend Foundation

Bilingual (English/Arabic) payment infrastructure platform. Phase 1 delivers the complete Supabase backend: schema, RLS, storage, seed data, and TypeScript types.

---

## Project Structure

```
ontarget-payment-os/
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql   ← Full schema + RLS + functions + triggers
│   ├── seed.sql                     ← Demo data (merchants, wallets, transactions)
│   └── storage.sql                  ← Storage buckets + policies
├── types/
│   └── database.types.ts            ← TypeScript types for all tables
└── README.md
```

---

## Database Tables

| Table | Purpose |
|---|---|
| `profiles` | User accounts linked to `auth.users` |
| `merchants` | Merchant businesses |
| `merchant_api_keys` | Hashed API keys per merchant |
| `payment_methods` | Vodafone Cash, Orange, InstaPay, USDT, etc. |
| `payment_accounts` | Actual wallet/bank accounts for receiving |
| `transactions` | Every payment (deposit or payout) |
| `transaction_events` | Status change history per transaction |
| `raw_events` | Raw SMS/email/n8n payloads for auto-matching |
| `wallet_allocations` | Which wallet was assigned to which transaction |
| `settlements` | Merchant settlement periods |
| `settlement_items` | Transactions inside a settlement |
| `callbacks` | Merchant webhook delivery log |
| `audit_logs` | Admin action history |
| `fees_rules` | Configurable fee rules per merchant/method |
| `notifications` | In-app notifications |

---

## How to Apply

### Step 1 — Create a Supabase project

Go to [supabase.com](https://supabase.com), create a new project, and note:
- Project URL
- Anon key (public)
- Service Role key (keep secret — Edge Functions only)

### Step 2 — Run the migration

In the Supabase dashboard → **SQL Editor**:

1. Open `supabase/migrations/001_initial_schema.sql`
2. Paste the full content
3. Click **Run**

This creates all 15 tables, enums, indexes, RLS policies, helper functions, and triggers.

### Step 3 — Run storage setup

In **SQL Editor**:

1. Open `supabase/storage.sql`
2. Paste and **Run**

This creates three buckets:
- `payment-proofs` — private, customer proof uploads
- `merchant-assets` — public, merchant logos
- `settlement-reports` — private, PDF/CSV reports

### Step 4 — Seed demo data (optional)

In **SQL Editor**:

1. Open `supabase/seed.sql`
2. Paste and **Run**

This creates:
- 13 payment methods (Vodafone Cash, Orange, InstaPay, USDT, etc.)
- 3 demo merchants
- 2 API keys
- 6 payment accounts (wallets)
- 5 demo transactions (approved, under review, created, declined, expired)
- Transaction events, wallet allocations, raw events, callbacks, settlement

### Step 5 — Create admin user

After seeding, create your admin account via Supabase Auth (dashboard → Authentication → Users → Add user), then run:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-admin@email.com';
```

### Step 6 — Create merchant user (optional)

Create a user via Auth, then:

```sql
UPDATE public.profiles
SET
  role = 'merchant',
  merchant_id = '22222222-0001-0001-0001-000000000001'
WHERE email = 'merchant@demo.com';
```

---

## Security Model

| Actor | What they can access |
|---|---|
| **Admin** | Everything |
| **Operator** | Transactions, raw events, callbacks (read + approve/decline) |
| **Merchant** | Own merchant, own transactions, own settlements, own API keys |
| **Public / Checkout** | Nothing directly — only via signed Edge Function responses |

### Key security rules:
- `payment_accounts` — **no direct access** for merchants or public. Wallet details are returned only by Edge Functions using the service role key.
- `merchant_api_keys` — key hash is stored, never the raw key. Key prefix only is shown in UI.
- `checkout_token` — cryptographically random, expires in 30 minutes.
- `proof_url` — private bucket, accessible only via signed URLs.
- Every status change writes to `transaction_events`.
- Every admin action writes to `audit_logs`.

---

## TypeScript Usage

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types/database.types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Fully typed query
const { data: transactions } = await supabase
  .from('transactions')
  .select('*')
  .eq('status', 'under_review')
  .order('created_at', { ascending: false })

// data is Transaction[] with full type safety
```

---

## Demo API Keys (seed data)

| Merchant | Key (for testing only) |
|---|---|
| Demo Store | `ontarget_live_demo_api_key_001` |
| Tech Shop | `ontarget_live_tech_api_key_002` |

---

## Phase 2 — Next Step

After reviewing and applying Phase 1, Phase 2 builds the Edge Functions:

- `POST /create-payment` — merchant API, validates key, creates transaction
- `GET /get-checkout` — public, returns safe checkout data by token
- `POST /assign-payment-account` — internal, selects best wallet
- `POST /submit-payment-proof` — customer uploads proof
- `POST /approve-transaction` — admin approves, calculates fees, sends callback
- `POST /decline-transaction` — admin declines with reason
- `GET /get-transaction-status` — merchant polling endpoint
- `POST /receive-raw-event` — n8n webhook receiver + auto-match engine
- `POST /send-callback` — signed webhook delivery with retry

---

## Environment Variables (for Phase 2+)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Never expose in frontend:
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
```
