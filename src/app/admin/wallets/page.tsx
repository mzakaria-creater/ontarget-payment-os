'use client'
import { Topbar } from '@/components/layout/Topbar'
import { WalletStatusBadge } from '@/components/ui/StatusBadge'
import { WALLETS } from '@/lib/mock-data'
import { formatAmount } from '@/lib/utils'
import { Wallet, TrendingUp, Plus, MoreHorizontal } from 'lucide-react'

export default function WalletsPage() {
  const active = WALLETS.filter(w => w.status === 'active').length
  const totalLimit = WALLETS.reduce((s, w) => s + w.daily_limit, 0)
  const totalUsed = WALLETS.reduce((s, w) => s + w.used_today, 0)
  const capacityPct = Math.round((totalUsed / totalLimit) * 100)

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Payment Accounts" subtitle="Wallets & bank accounts for receiving payments" role="admin" />

      <main className="flex-1 p-6 space-y-6">

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Wallets', value: WALLETS.length, icon: <Wallet size={16} /> },
            { label: 'Active',        value: active,          icon: <TrendingUp size={16} /> },
            { label: 'Daily Capacity',value: formatAmount(totalLimit), icon: <TrendingUp size={16} /> },
            { label: 'Used Today',    value: formatAmount(totalUsed) + ` (${capacityPct}%)`, icon: <TrendingUp size={16} /> },
          ].map(s => (
            <div key={s.label} className="rounded-2xl glass p-4">
              <p className="text-xs text-white/40 mb-1">{s.label}</p>
              <p className="text-lg font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Add button */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold btn-gold">
            <Plus size={15} /> Add Wallet
          </button>
        </div>

        {/* Wallet cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {WALLETS.map(wallet => {
            const usedPct = Math.min(100, Math.round((wallet.used_today / wallet.daily_limit) * 100))
            const barColor = usedPct >= 90 ? '#EF4444' : usedPct >= 70 ? '#F59E0B' : '#D4AF37'

            return (
              <div key={wallet.id} className="rounded-2xl glass p-5 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold"
                      style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                      {wallet.provider.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{wallet.label}</p>
                      <p className="text-xs text-white/40">{wallet.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <WalletStatusBadge status={wallet.status} />
                    <button className="text-white/30 hover:text-white/60 transition-colors">
                      <MoreHorizontal size={15} />
                    </button>
                  </div>
                </div>

                {/* Account info */}
                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-xs text-white/35 mb-0.5">Account</p>
                  <p className="text-sm font-mono text-white/70">{wallet.account_number}</p>
                  <p className="text-sm text-white/80 mt-1">{wallet.account_name}</p>
                </div>

                {/* Daily usage */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-white/40">Daily Usage</p>
                    <p className="text-xs font-semibold" style={{ color: barColor }}>{usedPct}%</p>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: usedPct + '%', background: barColor }} />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <p className="text-[10px] text-white/30">{formatAmount(wallet.used_today, wallet.currency)} used</p>
                    <p className="text-[10px] text-white/30">Limit: {formatAmount(wallet.daily_limit, wallet.currency)}</p>
                  </div>
                </div>

                {/* Limits */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                  <div>
                    <p className="text-[10px] text-white/30 mb-0.5">Min / Max</p>
                    <p className="text-xs text-white/60">{formatAmount(wallet.min_amount)} – {formatAmount(wallet.max_amount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 mb-0.5">Priority</p>
                    <p className="text-xs text-white/60">#{wallet.priority} · {wallet.currency}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
