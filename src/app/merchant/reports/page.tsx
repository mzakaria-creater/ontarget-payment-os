'use client'
import { Topbar } from '@/components/layout/Topbar'
import { formatAmount } from '@/lib/utils'

const weekData = [
  { day: 'Mon', amount: 12000 }, { day: 'Tue', amount: 8500 }, { day: 'Wed', amount: 18000 },
  { day: 'Thu', amount: 6000 },  { day: 'Fri', amount: 22000 }, { day: 'Sat', amount: 15000 }, { day: 'Sun', amount: 9250 },
]
const max = Math.max(...weekData.map(d => d.amount))

export default function MerchantReportsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Reports" subtitle="Demo Store · Analytics" role="merchant" />
      <main className="flex-1 p-6 space-y-6 max-w-3xl">
        <div className="rounded-2xl glass p-6">
          <h3 className="text-sm font-semibold text-white mb-6">Weekly Volume</h3>
          <div className="flex items-end gap-3 h-40">
            {weekData.map(d => {
              const pct = Math.round((d.amount / max) * 100)
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-[10px] text-white/30">{formatAmount(d.amount).split('.')[0]}</p>
                  <div className="w-full rounded-t-lg transition-all duration-700"
                    style={{ height: `${pct}%`, background: 'linear-gradient(to top, #D4AF37, #F0D060)', minHeight: '4px' }} />
                  <p className="text-[11px] text-white/40">{d.day}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl glass p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Method Distribution</h3>
          <div className="space-y-3">
            {[
              { name: 'Vodafone Cash', pct: 55, color: '#EF4444' },
              { name: 'Orange Cash',   pct: 20, color: '#F97316' },
              { name: 'InstaPay',      pct: 15, color: '#3B82F6' },
              { name: 'Bank Transfer', pct: 10, color: '#10B981' },
            ].map(m => (
              <div key={m.name}>
                <div className="flex justify-between mb-1"><span className="text-sm text-white/60">{m.name}</span><span className="text-sm font-semibold text-white">{m.pct}%</span></div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full" style={{ width: m.pct + '%', background: m.color, opacity: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
