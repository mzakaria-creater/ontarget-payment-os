export type Severity = 'critical' | 'high' | 'medium' | 'low'
export type PlatformStatus = 'online' | 'degraded' | 'offline'
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'escalated'
export type MethodStatus = 'active' | 'limited' | 'maintenance' | 'disabled'
export type P2PStatus = 'completed' | 'pending' | 'failed' | 'cancelled'

export interface PlatformMetric {
  label: string
  value: string
  sub: string
  trend?: string
  tone: 'gold' | 'purple' | 'green' | 'blue' | 'red'
}

export interface OperationRow {
  id: string
  type: 'Deposit' | 'Payout' | 'Transfer' | 'Refund' | 'Settlement'
  merchant: string
  customer: string
  amount: number
  currency: string
  method: string
  status: string
  risk: number
  source: 'API' | 'Dashboard' | 'Webhook' | 'n8n'
  receivedAt: string
  reference: string
}

export interface ApprovalItem {
  id: string
  title: string
  category: 'Merchant KYC' | 'Payout' | 'High Value' | 'Risk Flag'
  merchant: string
  amount?: number
  priority: Severity
  riskScore: number
  documents: string[]
  notes: string[]
  status: ReviewStatus
  createdAt: string
}

export interface MerchantProfile {
  id: string
  name: string
  tier: 'Starter' | 'Growth' | 'Enterprise'
  kyc: 'Verified' | 'Review' | 'Missing'
  riskScore: number
  volumeMonth: number
  successRate: number
  payoutMode: 'T+0' | 'T+1' | 'Manual'
  alerts: number
  country: string
}

export interface PaymentMethodConfig {
  id: string
  name: string
  type: 'E-wallet' | 'Bank' | 'Card' | 'Crypto' | 'Cash Collection' | 'Transfer'
  status: MethodStatus
  feePayin: number
  feePayout: number
  dailyLimit: number
  usedToday: number
  successRate: number
  settlement: string
}

export interface FinancialAccount {
  id: string
  label: string
  provider: string
  account: string
  type: 'Settlement' | 'Operating' | 'Reserve' | 'Crypto'
  total: number
  available: number
  locked: number
  dailyLimit: number
  usedToday: number
  currency: string
}

export interface P2POffer {
  id: string
  trader: string
  rating: number
  verified: boolean
  side: 'Buy' | 'Sell'
  asset: 'USDT' | 'EGP'
  price: number
  available: number
  min: number
  max: number
  methods: string[]
  completion: number
}

export interface KycStep {
  id: string
  title: string
  description: string
  status: 'completed' | 'current' | 'locked'
}

export interface P2PTransaction {
  id: string
  type: 'Send' | 'Receive' | 'Marketplace Buy' | 'Marketplace Sell'
  counterparty: string
  amount: number
  currency: string
  method: string
  status: P2PStatus
  date: string
  receipt: string
}

export interface PlatformAlert {
  id: string
  title: string
  description: string
  severity: Severity
  source: string
  createdAt: string
}

export const platformMetrics: PlatformMetric[] = [
  { label: 'Today Volume', value: '3.84M EGP', sub: 'All payment rails', trend: '+18.6%', tone: 'gold' },
  { label: 'Success Rate', value: '97.8%', sub: 'Last 24 hours', trend: '+2.1%', tone: 'green' },
  { label: 'Pending Reviews', value: '19', sub: 'KYC + payouts + risk', trend: '-7', tone: 'purple' },
  { label: 'System Health', value: '99.96%', sub: 'API, SMS, webhooks', trend: 'Live', tone: 'blue' },
]

export const volumeChart = [
  { time: '09:00', deposits: 210000, payouts: 52000, approvals: 22 },
  { time: '11:00', deposits: 420000, payouts: 84000, approvals: 37 },
  { time: '13:00', deposits: 760000, payouts: 130000, approvals: 48 },
  { time: '15:00', deposits: 990000, payouts: 190000, approvals: 58 },
  { time: '17:00', deposits: 1340000, payouts: 260000, approvals: 71 },
  { time: '19:00', deposits: 1810000, payouts: 310000, approvals: 89 },
  { time: '21:00', deposits: 2260000, payouts: 420000, approvals: 111 },
]

export const systemHealth = [
  { service: 'PSP API', status: 'online' as PlatformStatus, latency: '92ms', uptime: '99.99%' },
  { service: 'Supabase Realtime', status: 'online' as PlatformStatus, latency: '118ms', uptime: '99.96%' },
  { service: 'n8n Webhooks', status: 'online' as PlatformStatus, latency: '221ms', uptime: '99.91%' },
  { service: 'SMS Parser', status: 'degraded' as PlatformStatus, latency: '410ms', uptime: '98.72%' },
]

export const liveActivities = [
  'Vodafone Cash SMS matched TXN-78421 automatically',
  'Merchant payout batch approved for Exclusive Markets',
  'Orange Cash webhook received from n8n message center',
  'High-value InstaPay deposit moved to manual review',
  'Wallet VF-140 capacity reached 86% and rebalanced',
]

export const alerts: PlatformAlert[] = [
  { id: 'ALT-001', title: 'Wallet capacity warning', description: 'Vodafone Cash pool is above 85% of daily limit.', severity: 'high', source: 'Wallet Engine', createdAt: '2026-06-09 10:14' },
  { id: 'ALT-002', title: 'Parser confidence low', description: 'One Orange Cash SMS has missing reference number.', severity: 'medium', source: 'SMS Parser', createdAt: '2026-06-09 10:18' },
  { id: 'ALT-003', title: 'API traffic spike', description: 'Merchant checkout requests are 34% higher than baseline.', severity: 'low', source: 'Gateway', createdAt: '2026-06-09 10:21' },
]

export const operations: OperationRow[] = [
  { id: 'OPS-1001', type: 'Deposit', merchant: 'Exclusive Markets', customer: 'Ahmed Mahmoud', amount: 125000, currency: 'EGP', method: 'InstaPay', status: 'Auto Matched', risk: 28, source: 'Webhook', receivedAt: '10:04', reference: 'IP-883910' },
  { id: 'OPS-1002', type: 'Payout', merchant: 'HFM Egypt', customer: 'Mona Adel', amount: 64200, currency: 'EGP', method: 'Vodafone Cash', status: 'Pending Approval', risk: 71, source: 'Dashboard', receivedAt: '10:08', reference: 'PO-11920' },
  { id: 'OPS-1003', type: 'Deposit', merchant: 'OnTarget Demo', customer: 'Karim Nour', amount: 7800, currency: 'EGP', method: 'Orange Cash', status: 'Approved', risk: 18, source: 'n8n', receivedAt: '10:12', reference: 'OC-440192' },
  { id: 'OPS-1004', type: 'Settlement', merchant: 'Nagu Pay', customer: 'Finance Desk', amount: 25000, currency: 'USDT', method: 'TRC20', status: 'Processing', risk: 39, source: 'API', receivedAt: '10:16', reference: 'TRX-99201' },
  { id: 'OPS-1005', type: 'Refund', merchant: 'Tech Shop Egypt', customer: 'Sara Tarek', amount: 3300, currency: 'EGP', method: 'Bank Transfer', status: 'Failed Retry', risk: 55, source: 'API', receivedAt: '10:19', reference: 'RF-55010' },
]

export const approvals: ApprovalItem[] = [
  { id: 'APR-001', title: 'High-value InstaPay deposit', category: 'High Value', merchant: 'Exclusive Markets', amount: 250000, priority: 'critical', riskScore: 84, documents: ['bank_receipt.jpg', 'customer_id.pdf'], notes: ['Amount exceeds auto-approval limit', 'Reference matched but sender name differs'], status: 'pending', createdAt: '2026-06-09 09:42' },
  { id: 'APR-002', title: 'Merchant KYC renewal', category: 'Merchant KYC', merchant: 'Nagu Pay', priority: 'high', riskScore: 63, documents: ['commercial_register.pdf', 'tax_card.pdf'], notes: ['CR document expires soon'], status: 'pending', createdAt: '2026-06-09 09:55' },
  { id: 'APR-003', title: 'Payout batch review', category: 'Payout', merchant: 'HFM Egypt', amount: 142000, priority: 'medium', riskScore: 48, documents: ['batch_export.csv'], notes: ['12 wallet payouts ready'], status: 'escalated', createdAt: '2026-06-09 10:03' },
  { id: 'APR-004', title: 'Velocity risk flag', category: 'Risk Flag', merchant: 'Tech Shop Egypt', amount: 38000, priority: 'medium', riskScore: 58, documents: ['risk_trace.json'], notes: ['Six small deposits from same device'], status: 'pending', createdAt: '2026-06-09 10:09' },
]

export const merchantPortfolio: MerchantProfile[] = [
  { id: 'MER-001', name: 'Exclusive Markets', tier: 'Enterprise', kyc: 'Verified', riskScore: 31, volumeMonth: 12450000, successRate: 98.4, payoutMode: 'T+0', alerts: 1, country: 'Egypt' },
  { id: 'MER-002', name: 'HFM Egypt', tier: 'Enterprise', kyc: 'Verified', riskScore: 28, volumeMonth: 9820000, successRate: 97.6, payoutMode: 'T+0', alerts: 2, country: 'Egypt' },
  { id: 'MER-003', name: 'Nagu Pay', tier: 'Growth', kyc: 'Review', riskScore: 52, volumeMonth: 2180000, successRate: 94.3, payoutMode: 'T+1', alerts: 1, country: 'UAE' },
  { id: 'MER-004', name: 'Tech Shop Egypt', tier: 'Starter', kyc: 'Missing', riskScore: 69, volumeMonth: 540000, successRate: 91.8, payoutMode: 'Manual', alerts: 4, country: 'Egypt' },
]

export const paymentMethods: PaymentMethodConfig[] = [
  { id: 'PM-001', name: 'Vodafone Cash', type: 'E-wallet', status: 'active', feePayin: 1.5, feePayout: 1.0, dailyLimit: 1800000, usedToday: 1120000, successRate: 98.1, settlement: 'Instant wallet pool' },
  { id: 'PM-002', name: 'Orange Cash', type: 'E-wallet', status: 'active', feePayin: 1.6, feePayout: 1.1, dailyLimit: 900000, usedToday: 240000, successRate: 96.4, settlement: 'Instant wallet pool' },
  { id: 'PM-003', name: 'InstaPay', type: 'Transfer', status: 'active', feePayin: 1.2, feePayout: 0.8, dailyLimit: 2500000, usedToday: 780000, successRate: 99.2, settlement: 'Bank ledger' },
  { id: 'PM-004', name: 'Bank Transfer', type: 'Bank', status: 'limited', feePayin: 0.8, feePayout: 0.7, dailyLimit: 5000000, usedToday: 1210000, successRate: 95.6, settlement: 'T+0/T+1' },
  { id: 'PM-005', name: 'USDT TRC20', type: 'Crypto', status: 'active', feePayin: 0.4, feePayout: 0.4, dailyLimit: 100000, usedToday: 25000, successRate: 99.8, settlement: 'Crypto treasury' },
  { id: 'PM-006', name: 'Fawry Cash', type: 'Cash Collection', status: 'maintenance', feePayin: 2.0, feePayout: 1.5, dailyLimit: 1000000, usedToday: 0, successRate: 93.2, settlement: 'Collector balance' },
]

export const financialAccounts: FinancialAccount[] = [
  { id: 'ACC-001', label: 'Main EGP Settlement', provider: 'CIB Bank', account: 'EG38 **** 3004', type: 'Settlement', total: 1850000, available: 1420000, locked: 430000, dailyLimit: 5000000, usedToday: 1210000, currency: 'EGP' },
  { id: 'ACC-002', label: 'Vodafone Pool Alpha', provider: 'Vodafone Cash', account: '0101 **** 3295', type: 'Operating', total: 420000, available: 112000, locked: 308000, dailyLimit: 600000, usedToday: 488000, currency: 'EGP' },
  { id: 'ACC-003', label: 'Reserve & Chargeback', provider: 'Internal Ledger', account: 'RESERVE-EGP', type: 'Reserve', total: 620000, available: 0, locked: 620000, dailyLimit: 1000000, usedToday: 0, currency: 'EGP' },
  { id: 'ACC-004', label: 'USDT Treasury', provider: 'Binance', account: 'TRC20 **** 91AD', type: 'Crypto', total: 84200, available: 76600, locked: 7600, dailyLimit: 150000, usedToday: 25000, currency: 'USDT' },
]

export const p2pSummary = [
  { label: 'Available Balance', value: '148,250.00 EGP', sub: 'Ready to send', tone: 'gold' as const },
  { label: 'P2P Completion', value: '98.9%', sub: 'Last 30 days', tone: 'green' as const },
  { label: 'Open Offers', value: '42', sub: 'USDT / EGP', tone: 'purple' as const },
  { label: 'Verification Level', value: 'Level 3', sub: 'High limits enabled', tone: 'blue' as const },
]

export const p2pOffers: P2POffer[] = [
  { id: 'OFF-001', trader: 'MinaFX Desk', rating: 4.9, verified: true, side: 'Sell', asset: 'USDT', price: 49.85, available: 18500, min: 100, max: 2500, methods: ['Vodafone Cash', 'InstaPay'], completion: 99 },
  { id: 'OFF-002', trader: 'Delta OTC', rating: 4.8, verified: true, side: 'Buy', asset: 'USDT', price: 49.55, available: 9400, min: 50, max: 1200, methods: ['Bank Transfer'], completion: 97 },
  { id: 'OFF-003', trader: 'Cairo P2P Pro', rating: 4.7, verified: true, side: 'Sell', asset: 'USDT', price: 49.95, available: 5200, min: 25, max: 750, methods: ['Orange Cash', 'Vodafone Cash'], completion: 96 },
  { id: 'OFF-004', trader: 'FastPay MENA', rating: 4.6, verified: false, side: 'Buy', asset: 'USDT', price: 49.40, available: 12000, min: 200, max: 3000, methods: ['InstaPay', 'Bank Transfer'], completion: 94 },
]

export const kycSteps: KycStep[] = [
  { id: 'KYC-1', title: 'Personal Information', description: 'Legal name, phone number, date of birth, and address.', status: 'completed' },
  { id: 'KYC-2', title: 'ID Document Upload', description: 'National ID, passport, or residence card.', status: 'completed' },
  { id: 'KYC-3', title: 'Selfie / Liveness', description: 'Face check to protect account ownership.', status: 'current' },
  { id: 'KYC-4', title: 'Compliance Review', description: 'Final verification and limit assignment.', status: 'locked' },
]

export const p2pHistory: P2PTransaction[] = [
  { id: 'P2P-9001', type: 'Send', counterparty: 'Ahmed Mahmoud', amount: 12000, currency: 'EGP', method: 'Vodafone Cash', status: 'completed', date: '2026-06-09 09:12', receipt: 'RCPT-5501' },
  { id: 'P2P-9002', type: 'Marketplace Buy', counterparty: 'Delta OTC', amount: 450, currency: 'USDT', method: 'Bank Transfer', status: 'pending', date: '2026-06-09 09:44', receipt: 'RCPT-5502' },
  { id: 'P2P-9003', type: 'Receive', counterparty: 'Sara Adel', amount: 3200, currency: 'EGP', method: 'Orange Cash', status: 'completed', date: '2026-06-08 18:20', receipt: 'RCPT-5503' },
  { id: 'P2P-9004', type: 'Marketplace Sell', counterparty: 'Cairo P2P Pro', amount: 250, currency: 'USDT', method: 'InstaPay', status: 'failed', date: '2026-06-08 15:09', receipt: 'RCPT-5504' },
]

export function formatPlatformMoney(amount: number, currency = 'EGP') {
  return new Intl.NumberFormat('en-EG', { maximumFractionDigits: 2 }).format(amount) + ' ' + currency
}

export function riskTone(score: number) {
  if (score >= 75) return 'text-red-400 bg-red-500/10 border-red-500/20'
  if (score >= 55) return 'text-amber-300 bg-amber-500/10 border-amber-500/20'
  return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
}
