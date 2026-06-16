# OnTarget PSP Platform — React + Next API Build

This build adds the production-grade OnTarget PSP Platform UI directly inside the existing Next.js project.

## Main Entry

- `/` redirects to `/psp/dashboard`
- `/psp` redirects to `/psp/dashboard`
- `/p2p` redirects to `/p2p/hub`

## React Pages Built

### Core PSP Platform

1. `/psp/dashboard` — Enterprise dashboard with realtime-style metrics, health, alerts, activity feed, and volume chart.
2. `/psp/operations` — Transaction operations table with search, filters, risk score, retry action, and export action.
3. `/psp/approvals` — Approval queue for KYC, payout, high-value transactions, documents, notes, approve/reject/escalate actions.
4. `/psp/merchants` — Merchant portfolio, tiers, KYC state, payout mode, success rate, risk, alerts, and volume.
5. `/psp/payment-methods` — Payment rail configuration for wallets, banks, crypto, transfer, and cash collection.
6. `/psp/wallets-accounts` — Treasury console with settlement accounts, operating wallets, locked reserve, and transfer actions.

### P2P Payment System

7. `/p2p/hub` — P2P balance dashboard, quick actions, verification level, and recent activity.
8. `/p2p/send` — Multi-step send-money flow: recipient, amount, review, receipt.
9. `/p2p/marketplace` — Offer marketplace with trader ratings, verification badges, limits, payment methods, and filters.
10. `/p2p/kyc` — Four-step identity verification UI with document upload and selfie/liveness state.
11. `/p2p/history` — P2P transaction history with status, receipt IDs, and export action.

## Next API Routes Added

- `GET /api/platform` — Platform summary, counts, health, metrics, chart data.
- `GET /api/transactions` — Transaction operations list with optional `status` and `merchant` filters.
- `POST /api/transactions` — Accepts a new transaction payload and returns a normalized pending transaction response.
- `GET /api/approvals` — Approval queue list.
- `POST /api/approvals` — Approve, reject, or escalate an approval item.
- `GET /api/payment-methods` — Payment method configuration list.
- `GET /api/accounts` — Wallet/account list with totals.
- `GET /api/p2p` — P2P summary, offers, KYC steps, and history.
- `GET /api/webhooks/n8n` — Webhook endpoint info.
- `POST /api/webhooks/n8n` — n8n/SMS/email webhook receiver that normalizes provider, amount, reference, sender, receiver, and raw message.

## Files Added

- `src/lib/psp-platform-data.ts`
- `src/components/psp/PlatformShell.tsx`
- `src/app/psp/layout.tsx`
- `src/app/p2p/layout.tsx`
- PSP pages under `src/app/psp/*`
- P2P pages under `src/app/p2p/*`
- API routes under `src/app/api/*`
- `.github/workflows/next-build.yml`

## Build

```bash
npm install
npm run build
npm run dev
```

## Integration Notes

The current build uses realistic mock data with production-ready shapes. Replace `src/lib/psp-platform-data.ts` with Supabase queries or server actions when connecting live data.

Recommended live integration flow:

1. Supabase tables become the source of truth.
2. n8n posts SMS/email/webhook payloads to `/api/webhooks/n8n`.
3. Matching engine deduplicates, parses, and links messages to transactions.
4. Operations table reads live transactions.
5. Approval queue writes audit logs and status changes.
6. Telegram/email/SMS notifications are triggered after status changes.
