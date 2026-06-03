'use client'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ADMIN_STATS, TRANSACTIONS, formatCurrency } from '@/lib/mock-data'
import { formatAmount, formatDate } from '@/lib/utils'
import {
  TrendingUp, Zap, CheckCircle2, XCircle, Clock, Wallet, DollarSign, BarChart3
} from 'lucide-react'

export default function AdminDashboard() {
  const recent = TRANSACTIONS.slice(0, 5)

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Dashboard" subtitle="OnTarget Payment OS" role="admin" />

      <main className="flex-1 p-6 space-y-6">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Volume Today"
            value={formatAmount(ADMIN_STATS.volume_today)}
            sub="All merchants combined"
            icon={<TrendingUp size={18} />}
            accent="gold"
            trend="up" trendValue="+12.4% vs yesterday"
          />
          <StatCard
            label="Monthly Volume"
            value={formatAmount(ADMIN_STATS.volume_month)}
            sub="June 2026"
            icon={<BarChart3 size={18} />}
            accent="purple"
          />
          <StatCard
            label="Pending Approval"
            value={ADMIN_STATS.pending_approval}
            sub="Requires action"
            icon={<Clock size={18} />}
            accent="blue"
          />
          <StatCard
            label="Fees Collected"
            value={formatAmount(ADMIN_STATS.fees_today)}
            sub="Today"
            icon={<DollarSign size={18} />}
            accent="green"
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Auto Approved"  value={ADMIN_STATS.auto_approved}  icon={<Zap size={18} />}          accent="purple" />
          <StatCard label="Manual Approved" value={ADMIN_STATS.manual_approved} icon={<CheckCircle2 size={18} />} accent="green" />
          <StatCard label="Declined"        value={ADMIN_STATS.declined}        icon={<XCircle size={18} />}      accent="red" />
          <StatCard label="Wallet Capacity" value={ADMIN_STATS.wallet_capacity_pct + '%'} icon={<Wallet size={18} />} accent="gold" />
        </div>

        {/* Live Feed + Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent transactions */}
          <div className="lg:col-span-2 rounded-2xl glass overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Recent Transactions</h2>
                <p className="text-[11px] text-white/35 mt-0.5">Live feed — all merchants</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
                <span className="text-xs text-white/35">Live</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider">ID</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider">Merchant</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider">Method</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map(tx => (
                    <tr key={tx.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-mono text-white/60">{tx.transaction_id}</span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-white/80">{tx.merchant_name}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-semibold text-white">{formatAmount(tx.amount, tx.currency)}</span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-white/50">{tx.method}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={tx.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Volume breakdown */}
          <div className="space-y-4">
            <div className="rounded-2xl glass p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Today's Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: 'Deposits', value: ADMIN_STATS.deposits_today, color: '#10B981', pct: 90 },
                  { label: 'Payouts',  value: ADMIN_STATS.payouts_today,  color: '#D4AF37', pct: 10 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-white/50">{item.label}</span>
                      <span className="text-xs font-semibold text-white">{formatAmount(item.value)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: item.pct + '%', background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl glass p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Top Merchants</h3>
              <div className="space-y-3">
                {[
                  { name: 'Tech Shop',   volume: 25000, pct: 67 },
                  { name: 'Demo Store',  volume: 9250,  pct: 25 },
                  { name: 'Paused Co.', volume: 0,     pct: 0 },
                ].map(m => (
                  <div key={m.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-white/60">{m.name}</span>
                      <span className="text-xs font-semibold text-white">{formatAmount(m.volume)}</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5">
                      <div className="h-full rounded-full"
                        style={{ width: m.pct + '%', background: 'linear-gradient(90deg, #D4AF37, #F0D060)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
