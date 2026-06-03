export type TxStatus =
  | 'created' | 'pending' | 'proof_uploaded' | 'under_review'
  | 'auto_matched' | 'approved' | 'declined' | 'expired' | 'cancelled'

export type TxType = 'deposit' | 'payout'

export interface Transaction {
  id: string
  transaction_id: string
  merchant_name: string
  merchant_id: string
  merchant_order_id: string
  customer_name: string
  customer_phone: string
  amount: number
  currency: string
  type: TxType
  method: string
  method_code: string
  wallet_masked: string
  status: TxStatus
  fees: number
  net_amount: number
  created_at: string
  approved_at?: string
  decline_reason?: string
}

export interface Wallet {
  id: string
  provider: string
  account_number: string
  account_name: string
  label: string
  currency: string
  daily_limit: number
  used_today: number
  min_amount: number
  max_amount: number
  priority: number
  status: 'active' | 'paused' | 'full'
  method: string
}

export interface Merchant {
  id: string
  name: string
  code: string
  business_name: string
  email: string
  phone: string
  status: 'active' | 'paused' | 'suspended'
  currency: string
  volume_today: number
  volume_month: number
}

export interface RawEvent {
  id: string
  source: 'sms' | 'email' | 'binance' | 'manual' | 'n8n'
  provider: string
  amount: number
  currency: string
  sender: string
  reference: string
  matched_tx?: string
  status: 'received' | 'parsed' | 'matched' | 'failed' | 'duplicate'
  created_at: string
}

// ─── TRANSACTIONS ────────────────────────────────────────────
export const TRANSACTIONS: Transaction[] = [
  {
    id: '1', transaction_id: 'TXN-DEMO0001',
    merchant_name: 'Demo Store', merchant_id: 'm1', merchant_order_id: 'ORD-1001',
    customer_name: 'Ahmed Mohamed', customer_phone: '01000000001',
    amount: 5000, currency: 'EGP', type: 'deposit',
    method: 'Vodafone Cash', method_code: 'vodafone_cash', wallet_masked: '0100****1111',
    status: 'approved', fees: 75, net_amount: 4925,
    created_at: '2026-06-03 10:00', approved_at: '2026-06-03 10:08',
  },
  {
    id: '2', transaction_id: 'TXN-DEMO0002',
    merchant_name: 'Demo Store', merchant_id: 'm1', merchant_order_id: 'ORD-1002',
    customer_name: 'Sara Ahmed', customer_phone: '01100000002',
    amount: 2500, currency: 'EGP', type: 'deposit',
    method: 'Orange Cash', method_code: 'orange_cash', wallet_masked: '0120****3333',
    status: 'under_review', fees: 37.5, net_amount: 2462.5,
    created_at: '2026-06-03 11:30',
  },
  {
    id: '3', transaction_id: 'TXN-DEMO0003',
    merchant_name: 'Tech Shop', merchant_id: 'm2', merchant_order_id: 'ORD-2001',
    customer_name: 'Omar Hassan', customer_phone: '01200000003',
    amount: 10000, currency: 'EGP', type: 'deposit',
    method: 'InstaPay', method_code: 'instapay', wallet_masked: '0100****4444',
    status: 'auto_matched', fees: 150, net_amount: 9850,
    created_at: '2026-06-03 12:00',
  },
  {
    id: '4', transaction_id: 'TXN-DEMO0004',
    merchant_name: 'Demo Store', merchant_id: 'm1', merchant_order_id: 'ORD-1003',
    customer_name: 'Mona Ali', customer_phone: '01300000004',
    amount: 1000, currency: 'EGP', type: 'deposit',
    method: 'Vodafone Cash', method_code: 'vodafone_cash', wallet_masked: '0100****1111',
    status: 'declined', fees: 0, net_amount: 0,
    created_at: '2026-06-03 08:00',
    decline_reason: 'Transfer reference does not match',
  },
  {
    id: '5', transaction_id: 'TXN-DEMO0005',
    merchant_name: 'Tech Shop', merchant_id: 'm2', merchant_order_id: 'ORD-2002',
    customer_name: 'Youssef Khaled', customer_phone: '01400000005',
    amount: 3000, currency: 'EGP', type: 'deposit',
    method: 'WE Pay', method_code: 'we_pay', wallet_masked: '—',
    status: 'expired', fees: 0, net_amount: 0,
    created_at: '2026-06-02 20:00',
  },
  {
    id: '6', transaction_id: 'TXN-DEMO0006',
    merchant_name: 'Demo Store', merchant_id: 'm1', merchant_order_id: 'ORD-1004',
    customer_name: 'Hana Sayed', customer_phone: '01500000006',
    amount: 750, currency: 'EGP', type: 'payout',
    method: 'Vodafone Cash', method_code: 'vodafone_cash', wallet_masked: '0150****6789',
    status: 'approved', fees: 7.5, net_amount: 742.5,
    created_at: '2026-06-03 09:15', approved_at: '2026-06-03 09:20',
  },
  {
    id: '7', transaction_id: 'TXN-DEMO0007',
    merchant_name: 'Tech Shop', merchant_id: 'm2', merchant_order_id: 'ORD-2003',
    customer_name: 'Kareem Nour', customer_phone: '01600000007',
    amount: 15000, currency: 'EGP', type: 'deposit',
    method: 'Bank Transfer', method_code: 'bank_transfer', wallet_masked: 'CIB ****5503',
    status: 'proof_uploaded', fees: 0, net_amount: 0,
    created_at: '2026-06-03 13:00',
  },
]

// ─── WALLETS ─────────────────────────────────────────────────
export const WALLETS: Wallet[] = [
  {
    id: 'w1', provider: 'Vodafone Cash',
    account_number: '01001111111', account_name: 'محمد أحمد',
    label: 'VF Main Wallet', currency: 'EGP',
    daily_limit: 50000, used_today: 8500,
    min_amount: 100, max_amount: 10000,
    priority: 1, status: 'active', method: 'Vodafone Cash',
  },
  {
    id: 'w2', provider: 'Vodafone Cash',
    account_number: '01002222222', account_name: 'أحمد خالد',
    label: 'VF Backup', currency: 'EGP',
    daily_limit: 30000, used_today: 29800,
    min_amount: 50, max_amount: 5000,
    priority: 2, status: 'full', method: 'Vodafone Cash',
  },
  {
    id: 'w3', provider: 'Orange Cash',
    account_number: '01201333333', account_name: 'سارة محمود',
    label: 'Orange Main', currency: 'EGP',
    daily_limit: 40000, used_today: 2500,
    min_amount: 50, max_amount: 8000,
    priority: 1, status: 'active', method: 'Orange Cash',
  },
  {
    id: 'w4', provider: 'InstaPay',
    account_number: '01005444444', account_name: 'علي حسن',
    label: 'InstaPay Primary', currency: 'EGP',
    daily_limit: 100000, used_today: 10000,
    min_amount: 100, max_amount: 20000,
    priority: 1, status: 'active', method: 'InstaPay',
  },
  {
    id: 'w5', provider: 'CIB Bank',
    account_number: 'EG38000120010003004', account_name: 'OnTarget Payments',
    label: 'CIB Settlement Account', currency: 'EGP',
    daily_limit: 500000, used_today: 0,
    min_amount: 500, max_amount: 100000,
    priority: 1, status: 'paused', method: 'Bank Transfer',
  },
  {
    id: 'w6', provider: 'Binance',
    account_number: 'TRX_xxxxxxxxxxxxxx', account_name: 'OnTarget Crypto',
    label: 'USDT TRC20 Main', currency: 'USDT',
    daily_limit: 100000, used_today: 0,
    min_amount: 10, max_amount: 50000,
    priority: 1, status: 'active', method: 'USDT (TRC20)',
  },
]

// ─── MERCHANTS ───────────────────────────────────────────────
export const MERCHANTS: Merchant[] = [
  {
    id: 'm1', name: 'Demo Store', code: 'DEMO001',
    business_name: 'Demo Store LLC', email: 'merchant@demo.com', phone: '01000000001',
    status: 'active', currency: 'EGP',
    volume_today: 9250, volume_month: 142500,
  },
  {
    id: 'm2', name: 'Tech Shop', code: 'TECH002',
    business_name: 'Tech Shop Egypt', email: 'tech@shop.com', phone: '01100000002',
    status: 'active', currency: 'EGP',
    volume_today: 25000, volume_month: 312000,
  },
  {
    id: 'm3', name: 'Paused Co.', code: 'PAUSE003',
    business_name: 'Paused Merchant Ltd', email: 'paused@merchant.com', phone: '01200000003',
    status: 'paused', currency: 'EGP',
    volume_today: 0, volume_month: 8400,
  },
]

// ─── RAW EVENTS ──────────────────────────────────────────────
export const RAW_EVENTS: RawEvent[] = [
  {
    id: 're1', source: 'sms', provider: 'Vodafone Cash',
    amount: 5000, currency: 'EGP', sender: '01000000001',
    reference: 'VF-REF-001', matched_tx: 'TXN-DEMO0001',
    status: 'matched', created_at: '2026-06-03 10:01',
  },
  {
    id: 're2', source: 'sms', provider: 'Orange Cash',
    amount: 2500, currency: 'EGP', sender: '01100000002',
    reference: 'OR-REF-002', matched_tx: 'TXN-DEMO0002',
    status: 'matched', created_at: '2026-06-03 11:31',
  },
  {
    id: 're3', source: 'n8n', provider: 'webhook',
    amount: 500, currency: 'EGP', sender: '01500000099',
    reference: 'UNKNOWN-001',
    status: 'failed', created_at: '2026-06-03 12:05',
  },
  {
    id: 're4', source: 'email', provider: 'InstaPay',
    amount: 10000, currency: 'EGP', sender: 'Kareem Nour',
    reference: 'IP-REF-007', matched_tx: 'TXN-DEMO0003',
    status: 'matched', created_at: '2026-06-03 12:02',
  },
  {
    id: 're5', source: 'sms', provider: 'Vodafone Cash',
    amount: 5000, currency: 'EGP', sender: '01000000001',
    reference: 'VF-REF-001',
    status: 'duplicate', created_at: '2026-06-03 10:03',
  },
]

// ─── STATS HELPERS ────────────────────────────────────────────
export const ADMIN_STATS = {
  volume_today: 37250,
  volume_month: 463250,
  deposits_today: 33500,
  payouts_today: 3750,
  pending_approval: 3,
  auto_approved: 2,
  manual_approved: 1,
  declined: 1,
  fees_today: 270,
  wallet_capacity_pct: 62,
}

export const MERCHANT_STATS = {
  volume_today: 9250,
  volume_month: 142500,
  deposits_today: 8500,
  payouts_today: 750,
  pending: 1,
  approved: 2,
  declined: 1,
  fees_today: 112.5,
  net_settlement: 9137.5,
}

export const QUEUE_TRANSACTIONS = TRANSACTIONS.filter(
  t => ['under_review', 'proof_uploaded', 'auto_matched'].includes(t.status)
)

export const MERCHANT_TRANSACTIONS = TRANSACTIONS.filter(t => t.merchant_id === 'm1')

export const formatCurrency = (amount: number, currency = 'EGP') =>
  new Intl.NumberFormat('en-EG', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + ' ' + currency

export const STATUS_LABELS: Record<TxStatus, { en: string; ar: string; cls: string }> = {
  created:      { en: 'Created',      ar: 'تم الإنشاء',   cls: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  pending:      { en: 'Pending',      ar: 'قيد الانتظار', cls: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  proof_uploaded: { en: 'Proof Sent', ar: 'الإيصال مرسل', cls: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
  under_review: { en: 'Under Review', ar: 'قيد المراجعة', cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  auto_matched: { en: 'Auto Matched', ar: 'مطابق تلقائي', cls: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
  approved:     { en: 'Approved',     ar: 'معتمد',         cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  declined:     { en: 'Declined',     ar: 'مرفوض',         cls: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  expired:      { en: 'Expired',      ar: 'منتهي',         cls: 'bg-white/5 text-white/35 border border-white/10' },
  cancelled:    { en: 'Cancelled',    ar: 'ملغي',          cls: 'bg-white/5 text-white/35 border border-white/10' },
}
