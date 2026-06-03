'use client'
import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { TRANSACTIONS, type TxStatus } from '@/lib/mock-data'
import { formatAmount } from '@/lib/utils'
import { CheckCircle2, XCircle, Eye, Zap, Clock } from 'lucide-react'

type QueueStatus = TxStatus
const QUEUE_STATUSES: QueueStatus[] = ['under_review', 'proof_uploaded', 'auto_matched']

export default function LiveQueuePage() {
  const [statuses, setStatuses] = useState<Record<string, TxStatus>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})

  const queue = TRANSACTIONS.filter(tx =>
    QUEUE_STATUSES.includes(statuses[tx.id] ?? tx.status as QueueStatus)
  )

  function approve(id: string) {
    setStatuses(s => ({ ...s, [id]: 'approved' }))
  }
  function decline(id: string) {
    setStatuses(s => ({ ...s, [id]: 'declined' }))
  }

  const pending = queue.filter(tx => QUEUE_STATUSES.includes(statuses[tx.id] ?? tx.status as QueueStatus))

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Live Queue" subtitle="Real-time approval · Auto-refresh every 5s" role="admin" />

      <main className="flex-1 p-6 space-y-5">

        {/* Header stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'In Queue', value: pending.length, icon: <Clock size={16} />, color: 'rgba(212,175,55,0.1)', text: '#D4AF37' },
            { label: 'Auto Matched', value: TRANSACTIONS.filter(t => t.status === 'auto_matched').length, icon: <Zap size={16} />, color: 'rgba(124,58,237,0.1)', text: '#9F67FF' },
            { label: 'Approved Today', value: Object.values(statuses).filter(s => s === 'approved').length + 1, icon: <CheckCircle2 size={16} />, color: 'rgba(16,185,129,0.1)', text: '#10B981' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 glass flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: s.color, color: s.text }}>
                {s.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/40">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Queue table */}
        <div className="rounded-2xl glass overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse-dot" />
              <h2 className="text-sm font-semibold text-white">Approval Queue</h2>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
              {pending.length} pending
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Transaction', 'Merchant', 'Customer', 'Amount', 'Method', 'Wallet', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map(tx => {
                  const currentStatus = (statuses[tx.id] ?? tx.status) as TxStatus
                  const isActive = QUEUE_STATUSES.includes(currentStatus)
                  return (
                    <tr key={tx.id}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-xs font-mono text-white/70">{tx.transaction_id}</p>
                          <p className="text-[10px] text-white/30 mt-0.5">{tx.created_at}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-white/80">{tx.merchant_name}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-white/80">{tx.customer_name}</p>
                        <p className="text-[11px] text-white/35">{tx.customer_phone}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-white">{formatAmount(tx.amount, tx.currency)}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-white/50">{tx.method}</td>
                      <td className="px-5 py-4 text-xs font-mono text-white/50">{tx.wallet_masked}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={currentStatus} />
                      </td>
                      <td className="px-5 py-4">
                        {isActive ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => approve(tx.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                              style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)' }}>
                              <CheckCircle2 size={12} /> Approve
                            </button>
                            <button onClick={() => decline(tx.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                              style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                              <XCircle size={12} /> Decline
                            </button>
                          </div>
                        ) : (
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white/30">
                            <Eye size={12} /> View
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {TRANSACTIONS.length === 0 && (
            <div className="text-center py-16">
              <CheckCircle2 size={40} className="text-emerald-400/40 mx-auto mb-3" />
              <p className="text-white/40 text-sm">Queue is empty — all caught up!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
