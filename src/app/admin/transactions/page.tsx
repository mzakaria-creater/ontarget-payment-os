'use client'
import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { TRANSACTIONS } from '@/lib/mock-data'
import { formatAmount } from '@/lib/utils'
import { Search, Filter, Download } from 'lucide-react'

export default function AdminTransactionsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = TRANSACTIONS.filter(tx => {
    const matchSearch = !search ||
      tx.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
      tx.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      tx.merchant_name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || tx.status === filter
    return matchSearch && matchFilter
  })

  const statusFilters = ['all', 'approved', 'under_review', 'auto_matched', 'declined', 'expired']

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Transactions" subtitle="All merchants · All statuses" role="admin" />

      <main className="flex-1 p-6 space-y-5">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search transaction ID, customer, merchant…"
              className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm input-dark"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize"
                style={filter === s
                  ? { background: 'linear-gradient(135deg, #D4AF37, #A88C20)', color: '#000' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {s === 'all' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white/50 hover:text-white glass transition-all">
            <Download size={13} /> Export
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl glass overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <p className="text-sm font-semibold text-white">{filtered.length} transactions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Transaction ID', 'Merchant', 'Customer', 'Amount', 'Type', 'Method', 'Wallet', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono text-white/60">{tx.transaction_id}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-white/80">{tx.merchant_name}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-white/80">{tx.customer_name}</p>
                      <p className="text-[11px] text-white/35">{tx.customer_phone}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-white">{formatAmount(tx.amount, tx.currency)}</p>
                      {tx.fees > 0 && <p className="text-[11px] text-white/30">Fee: {formatAmount(tx.fees)}</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`badge text-[11px] ${tx.type === 'deposit'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-white/50">{tx.method}</td>
                    <td className="px-5 py-3.5 text-xs font-mono text-white/40">{tx.wallet_masked}</td>
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
