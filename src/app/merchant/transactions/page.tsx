'use client'
import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { MERCHANT_TRANSACTIONS } from '@/lib/mock-data'
import { formatAmount } from '@/lib/utils'
import { Search, Download } from 'lucide-react'

export default function MerchantTransactionsPage() {
  const [search, setSearch] = useState('')

  const filtered = MERCHANT_TRANSACTIONS.filter(tx =>
    !search ||
    tx.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
    tx.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    tx.merchant_order_id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Transactions" subtitle="Demo Store · All transactions" role="merchant" />
      <main className="flex-1 p-6 space-y-5">

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, customer, order…"
              className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm input-dark" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white/50 hover:text-white glass transition-all">
            <Download size={13} /> Export
          </button>
        </div>

        <div className="rounded-2xl glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Transaction ID', 'Order ID', 'Customer', 'Amount', 'Fees', 'Net', 'Method', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono text-white/60">{tx.transaction_id}</td>
                    <td className="px-5 py-3.5 text-xs text-white/40">{tx.merchant_order_id}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-white/80">{tx.customer_name}</p>
                      <p className="text-[11px] text-white/30">{tx.customer_phone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-white">{formatAmount(tx.amount, tx.currency)}</td>
                    <td className="px-5 py-3.5 text-sm text-white/40">{tx.fees > 0 ? formatAmount(tx.fees) : '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-emerald-400">{tx.net_amount > 0 ? formatAmount(tx.net_amount) : '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-white/50">{tx.method}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={tx.status} /></td>
                    <td className="px-5 py-3.5 text-xs text-white/35 whitespace-nowrap">{tx.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/30 text-sm">No transactions found</div>
          )}
        </div>
      </main>
    </div>
  )
}
