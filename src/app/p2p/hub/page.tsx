import { ArrowUpRight, Send, Store, Wallet } from 'lucide-react'
import { GlassCard, MetricTile, PageHeading, PrimaryButton, SoftButton, StatusPill } from '@/components/psp/PlatformShell'
import { p2pHistory, p2pSummary } from '@/lib/psp-platform-data'

export default function P2PHubPage() {
  return (
    <div>
      <PageHeading eyebrow="P2P Payment System" title="P2P Hub" description="Consumer-facing wallet balance, quick actions, verification level, recent activity, and marketplace shortcuts." action={<PrimaryButton><Send size={15}/> Send Money</PrimaryButton>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {p2pSummary.map(item => <MetricTile key={item.label} {...item} icon={item.label.includes('Balance') ? <Wallet size={18}/> : item.label.includes('Offers') ? <Store size={18}/> : <ArrowUpRight size={18}/>}/>) }
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <GlassCard>
          <h2 className="text-xl font-black text-white">Quick Actions</h2>
          <p className="mt-1 text-sm text-white/40">Fast P2P flows for daily operations.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <SoftButton><Send size={15}/> Send EGP</SoftButton>
            <SoftButton><ArrowUpRight size={15}/> Request Money</SoftButton>
            <SoftButton><Store size={15}/> Browse USDT</SoftButton>
            <SoftButton><Wallet size={15}/> Add Wallet</SoftButton>
          </div>
          <div className="mt-6 rounded-3xl border border-gold/20 bg-gold/10 p-5">
            <p className="text-sm font-black text-gold">Verification Level 3</p>
            <p className="mt-2 text-sm text-white/50">High daily limits enabled with verified phone, ID document, and liveness check.</p>
          </div>
        </GlassCard>
        <GlassCard>
          <h2 className="mb-4 text-xl font-black text-white">Recent P2P Activity</h2>
          <div className="space-y-3">
            {p2pHistory.slice(0,4).map(row => (
              <div key={row.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div><p className="font-bold text-white">{row.type} · {row.counterparty}</p><p className="text-xs text-white/35">{row.id} · {row.method} · {row.date}</p></div>
                <div className="text-right"><p className="font-black text-white">{row.amount.toLocaleString()} {row.currency}</p><StatusPill status={row.status}/></div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
