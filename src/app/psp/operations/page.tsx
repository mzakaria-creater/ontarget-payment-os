'use client'

import { useMemo, useState } from 'react'
import { Download, Filter, RefreshCcw, Search } from 'lucide-react'
import { PageHeading, GlassCard, MoneyCell, PrimaryButton, RiskBadge, SoftButton, StatusPill } from '@/components/psp/PlatformShell'
import { operations } from '@/lib/psp-platform-data'

export default function OperationsPage() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All')
  const rows = useMemo(() => operations.filter(row => {
    const text = `${row.id} ${row.type} ${row.merchant} ${row.customer} ${row.method} ${row.reference}`.toLowerCase()
    return text.includes(query.toLowerCase()) && (type === 'All' || row.type === type)
  }), [query, type])

  return (
    <div>
      <PageHeading eyebrow="Operations Management" title="Transaction Operations" description="Track deposits, payouts, transfers, refunds, settlements, retries, and error states with one operational table." action={<PrimaryButton><Download size={15}/> Export CSV</PrimaryButton>} />

      <GlassCard className="mb-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search transaction, merchant, customer, method, reference…" className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-gold/50" />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', 'Deposit', 'Payout', 'Transfer', 'Refund', 'Settlement'].map(item => (
              <button key={item} onClick={() => setType(item)} className={`rounded-2xl px-3 py-2 text-xs font-bold ${type === item ? 'bg-gold text-black' : 'border border-white/10 bg-white/5 text-white/55'}`}>{item}</button>
            ))}
            <SoftButton><Filter size={14}/> Advanced</SoftButton>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                {['ID', 'Type', 'Merchant', 'Customer', 'Amount', 'Method', 'Status', 'Risk', 'Source', 'Action'].map(head => <th key={head} className="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-white/35">{head}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} className="border-b border-white/[0.04] hover:bg-white/[0.025]">
                  <td className="px-5 py-4 font-mono text-xs text-white/55">{row.id}<p className="text-white/25">{row.reference}</p></td>
                  <td className="px-5 py-4"><StatusPill status={row.type}/></td>
                  <td className="px-5 py-4 text-sm font-semibold text-white">{row.merchant}</td>
                  <td className="px-5 py-4 text-sm text-white/65">{row.customer}</td>
                  <td className="px-5 py-4"><MoneyCell amount={row.amount} currency={row.currency}/></td>
                  <td className="px-5 py-4 text-sm text-white/55">{row.method}</td>
                  <td className="px-5 py-4"><StatusPill status={row.status}/></td>
                  <td className="px-5 py-4"><RiskBadge score={row.risk}/></td>
                  <td className="px-5 py-4 text-xs text-white/45">{row.source}<p className="text-white/25">{row.receivedAt}</p></td>
                  <td className="px-5 py-4"><button className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/55 hover:text-gold"><RefreshCcw size={15}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
