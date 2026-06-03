'use client'
import { Topbar } from '@/components/layout/Topbar'
import { formatAmount } from '@/lib/utils'
import { Download } from 'lucide-react'

const SETTLEMENTS = [
  { id: 1, period: 'Jun 1–3, 2026', gross: 5000, fees: 75, net: 4925, txCount: 1, status: 'completed' },
  { id: 2, period: 'May 26–31, 2026', gross: 42000, fees: 630, net: 41370, txCount: 14, status: 'completed' },
  { id: 3, period: 'May 19–25, 2026', gross: 38500, fees: 577.5, net: 37922.5, txCount: 11, status: 'completed' },
  { id: 4, period: 'Jun 4–10, 2026',  gross: 0,    fees: 0,    net: 0,       txCount: 0, status: 'pending' },
]

const statusMap: Record<string, string> = {
  completed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  pending:   'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  processing:'bg-blue-500/10 text-blue-400 border border-blue-500/20',
}

export default function SettlementsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Settlements" subtitle="Demo Store · Settlement history" role="merchant" />
      <main className="flex-1 p-6 space-y-5">

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl glass p-4">
            <p className="text-xs text-white/40 mb-1">Total Settled</p>
            <p className="text-xl font-bold text-white">{formatAmount(85500)}</p>
          </div>
          <div className="rounded-2xl glass p-4">
            <p className="text-xs text-white/40 mb-1">Total Fees</p>
            <p className="text-xl font-bold text-white">{formatAmount(1282.5)}</p>
          </div>
          <div className="rounded-2xl glass p-4">
            <p className="text-xs text-white/40 mb-1">Net Received</p>
            <p className="text-xl font-bold" style={{ color: '#D4AF37' }}>{formatAmount(84217.5)}</p>
          </div>
        </div>

        <div className="rounded-2xl glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Period', 'Transactions', 'Gross Amount', 'Fees', 'Net Amount', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SETTLEMENTS.map(s => (
                  <tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-sm text-white font-medium">{s.period}</td>
                    <td className="px-5 py-3.5 text-sm text-white/60">{s.txCount}</td>
                    <td className="px-5 py-3.5 text-sm text-white">{s.gross > 0 ? formatAmount(s.gross) : '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-white/50">{s.fees > 0 ? formatAmount(s.fees) : '—'}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: '#D4AF37' }}>{s.net > 0 ? formatAmount(s.net) : '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${statusMap[s.status]}`}>
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {s.status === 'completed' && (
                        <button className="text-white/30 hover:text-white/60 transition-colors">
                          <Download size={14} />
                        </button>
                      )}
                    </td>
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
