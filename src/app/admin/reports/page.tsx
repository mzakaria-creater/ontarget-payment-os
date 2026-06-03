'use client'
import { Topbar } from '@/components/layout/Topbar'
import { formatAmount } from '@/lib/utils'
import { BarChart3, Download } from 'lucide-react'

const dailyData = [
  { day: 'Mon', deposits: 42000, payouts: 8000 },
  { day: 'Tue', deposits: 38000, payouts: 5000 },
  { day: 'Wed', deposits: 55000, payouts: 12000 },
  { day: 'Thu', deposits: 31000, payouts: 6000 },
  { day: 'Fri', deposits: 67000, payouts: 15000 },
  { day: 'Sat', deposits: 48000, payouts: 9000 },
  { day: 'Sun', deposits: 37250, payouts: 3750 },
]
const max = Math.max(...dailyData.map(d => d.deposits + d.payouts))

const methodData = [
  { method: 'Vodafone Cash', volume: 98000, pct: 42, color: '#EF4444' },
  { method: 'Orange Cash',   volume: 45000, pct: 19, color: '#F97316' },
  { method: 'InstaPay',      volume: 62000, pct: 27, color: '#3B82F6' },
  { method: 'Bank Transfer', volume: 28000, pct: 12, color: '#10B981' },
]

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Reports & Analytics" subtitle="June 2026 · All merchants" role="admin" />
      <main className="flex-1 p-6 space-y-6">

        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium glass text-white/60 hover:text-white transition-all">
            <Download size={14} /> Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Daily Volume Chart */}
          <div className="rounded-2xl glass p-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold text-white">Daily Volume</h3>
                <p className="text-xs text-white/35 mt-0.5">Last 7 days</p>
              </div>
              <BarChart3 size={16} className="text-white/30" />
            </div>
            <div className="flex items-end gap-2 h-40">
              {dailyData.map(d => {
                const total = d.deposits + d.payouts
                const depH = Math.round((d.deposits / max) * 100)
                const payH = Math.round((d.payouts / max) * 100)
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: '120px' }}>
                      <div className="w-full rounded-t-sm" style={{ height: depH + '%', background: 'linear-gradient(to top, #D4AF37, #F0D060)', opacity: 0.9 }} />
                      <div className="w-full rounded-t-sm" style={{ height: Math.min(payH, 100 - depH) + '%', background: 'rgba(124,58,237,0.5)' }} />
                    </div>
                    <p className="text-[10px] text-white/30">{d.day}</p>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm" style={{ background: '#D4AF37' }}/><span className="text-xs text-white/40">Deposits</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-purple-500/50"/><span className="text-xs text-white/40">Payouts</span></div>
            </div>
          </div>

          {/* Method breakdown */}
          <div className="rounded-2xl glass p-5">
            <h3 className="text-sm font-semibold text-white mb-6">Volume by Method</h3>
            <div className="space-y-4">
              {methodData.map(m => (
                <div key={m.method}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                      <span className="text-sm text-white/70">{m.method}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-white">{formatAmount(m.volume)}</span>
                      <span className="text-xs text-white/30 ml-2">{m.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: m.pct + '%', background: m.color, opacity: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly summary table */}
          <div className="lg:col-span-2 rounded-2xl glass overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <h3 className="text-sm font-semibold text-white">Merchant Summary — June 2026</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Merchant', 'Deposits', 'Payouts', 'Total Volume', 'Fees', 'Net Settlement'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Tech Shop',  dep: 280000, pay: 32000, fees: 4680, net: 307320 },
                  { name: 'Demo Store', dep: 128000, pay: 14500, fees: 2137.5, net: 140362.5 },
                  { name: 'Paused Co.', dep: 7560,  pay: 840,   fees: 151.2, net: 8248.8 },
                ].map(m => (
                  <tr key={m.name} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-white">{m.name}</td>
                    <td className="px-5 py-3.5 text-sm text-emerald-400">{formatAmount(m.dep)}</td>
                    <td className="px-5 py-3.5 text-sm text-orange-400">{formatAmount(m.pay)}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-white">{formatAmount(m.dep + m.pay)}</td>
                    <td className="px-5 py-3.5 text-sm text-white/50">{formatAmount(m.fees)}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: '#D4AF37' }}>{formatAmount(m.net)}</td>
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
