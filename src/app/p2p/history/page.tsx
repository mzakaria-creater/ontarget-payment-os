import { Download, Receipt } from 'lucide-react'
import { GlassCard, PageHeading, PrimaryButton, StatusPill } from '@/components/psp/PlatformShell'
import { p2pHistory } from '@/lib/psp-platform-data'

export default function P2PHistoryPage() {
  return (
    <div>
      <PageHeading eyebrow="Records & Receipts" title="P2P History" description="Complete P2P transaction history with analytics, searchable rows, category breakdown, receipt IDs, and export-friendly table." action={<PrimaryButton><Download size={15}/> Export</PrimaryButton>} />
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <GlassCard><p className="text-xs text-white/40">Transactions</p><p className="mt-2 text-3xl font-black text-white">{p2pHistory.length}</p></GlassCard>
        <GlassCard><p className="text-xs text-white/40">Completed</p><p className="mt-2 text-3xl font-black text-emerald-300">2</p></GlassCard>
        <GlassCard><p className="text-xs text-white/40">Pending</p><p className="mt-2 text-3xl font-black text-amber-300">1</p></GlassCard>
        <GlassCard><p className="text-xs text-white/40">Failed</p><p className="mt-2 text-3xl font-black text-red-300">1</p></GlassCard>
      </div>
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead><tr className="border-b border-white/10 bg-white/[0.03]">{['ID','Type','Counterparty','Amount','Method','Status','Date','Receipt'].map(h=><th key={h} className="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-white/35">{h}</th>)}</tr></thead>
            <tbody>{p2pHistory.map(row=><tr key={row.id} className="border-b border-white/[0.04] hover:bg-white/[0.025]"><td className="px-5 py-4 font-mono text-xs text-white/55">{row.id}</td><td className="px-5 py-4 text-sm font-bold text-white">{row.type}</td><td className="px-5 py-4 text-sm text-white/65">{row.counterparty}</td><td className="px-5 py-4 font-black text-white">{row.amount.toLocaleString()} {row.currency}</td><td className="px-5 py-4 text-sm text-white/55">{row.method}</td><td className="px-5 py-4"><StatusPill status={row.status}/></td><td className="px-5 py-4 text-xs text-white/40">{row.date}</td><td className="px-5 py-4"><span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60"><Receipt size={14}/>{row.receipt}</span></td></tr>)}</tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
