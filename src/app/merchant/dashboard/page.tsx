'use client'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { MERCHANT_STATS, MERCHANT_TRANSACTIONS } from '@/lib/mock-data'
import { formatAmount } from '@/lib/utils'
import { TrendingUp, Clock, CheckCircle2, XCircle, DollarSign, BarChart3, PlusCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function MerchantDashboard() {
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Demo Store" subtitle="Merchant Dashboard · DEMO001" role="merchant" />

      <main className="flex-1 p-6 space-y-6">

        {/* Quick action */}
        <div className="rounded-2xl p-5 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(124,58,237,0.08))', border: '1px solid rgba(212,175,55,0.2)' }}>
          <div>
            <p className="text-sm font-semibold text-white">Create a new payment</p>
            <p className="text-xs text-white/40 mt-0.5">Generate a checkout link and share with your customer</p>
          </div>
          <Link href="/merchant/create-payment"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold btn-gold whitespace-nowrap">
            <PlusCircle size={15} /> New Payment
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Volume Today"    value={formatAmount(MERCHANT_STATS.volume_today)}   icon={<TrendingUp size={18} />}    accent="gold" trend="up" trendValue="+8.2%" />
          <StatCard label="Monthly Volume"  value={formatAmount(MERCHANT_STATS.volume_month)}   icon={<BarChart3 size={18} />}     accent="purple" />
          <StatCard label="Pending"         value={MERCHANT_STATS.pending}                       icon={<Clock size={18} />}         accent="blue" />
          <StatCard label="Net Settlement"  value={formatAmount(MERCHANT_STATS.net_settlement)}  icon={<DollarSign size={18} />}    accent="green" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Approved"  value={MERCHANT_STATS.approved}  icon={<CheckCircle2 size={18} />} accent="green" />
          <StatCard label="Declined"  value={MERCHANT_STATS.declined}  icon={<XCircle size={18} />}      accent="red" />
          <StatCard label="Fees Paid" value={formatAmount(MERCHANT_STATS.fees_today)} icon={<DollarSign size={18} />} accent="gold" />
        </div>

        {/* Recent transactions */}
        <div className="rounded-2xl glass overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Transactions</h2>
            <Link href="/merchant/transactions"
              className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['ID', 'Customer', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MERCHANT_TRANSACTIONS.map(tx => (
                  <tr key={tx.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono text-white/50">{tx.transaction_id}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-white/80">{tx.customer_name}</p>
                      <p className="text-[11px] text-white/30">{tx.merchant_order_id}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-white">{formatAmount(tx.amount, tx.currency)}</td>
                    <td className="px-5 py-3.5 text-xs text-white/50">{tx.method}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={tx.status} /></td>
                    <td className="px-5 py-3.5 text-xs text-white/35">{tx.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
