'use client'
import { Topbar } from '@/components/layout/Topbar'
import { SourceBadge, EventStatusBadge } from '@/components/ui/StatusBadge'
import { RAW_EVENTS } from '@/lib/mock-data'
import { formatAmount } from '@/lib/utils'
import { Terminal } from 'lucide-react'

export default function RawEventsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Raw Events" subtitle="SMS · Email · Binance · n8n · Manual" role="admin" />
      <main className="flex-1 p-6 space-y-5">

        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'Total',     value: RAW_EVENTS.length },
            { label: 'Matched',   value: RAW_EVENTS.filter(e => e.status === 'matched').length },
            { label: 'Failed',    value: RAW_EVENTS.filter(e => e.status === 'failed').length },
            { label: 'Duplicate', value: RAW_EVENTS.filter(e => e.status === 'duplicate').length },
            { label: 'SMS',       value: RAW_EVENTS.filter(e => e.source === 'sms').length },
          ].map(s => (
            <div key={s.label} className="rounded-xl glass p-3 text-center">
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-[11px] text-white/35">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl glass overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <Terminal size={14} className="text-white/40" />
            <h2 className="text-sm font-semibold text-white">Event Log</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Source', 'Provider', 'Amount', 'Sender', 'Reference', 'Matched TX', 'Status', 'Time'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RAW_EVENTS.map(e => (
                  <tr key={e.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5"><SourceBadge source={e.source} /></td>
                    <td className="px-5 py-3.5 text-sm text-white/70">{e.provider}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-white">{formatAmount(e.amount, e.currency)}</td>
                    <td className="px-5 py-3.5 text-sm text-white/60">{e.sender}</td>
                    <td className="px-5 py-3.5 text-xs font-mono text-white/40">{e.reference}</td>
                    <td className="px-5 py-3.5">
                      {e.matched_tx
                        ? <span className="text-xs font-mono text-emerald-400">{e.matched_tx}</span>
                        : <span className="text-xs text-white/20">—</span>}
                    </td>
                    <td className="px-5 py-3.5"><EventStatusBadge status={e.status} /></td>
                    <td className="px-5 py-3.5 text-xs text-white/35">{e.created_at}</td>
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
