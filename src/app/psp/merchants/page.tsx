import { Bell, Plus, UserCheck } from 'lucide-react'
import { PageHeading, GlassCard, MoneyCell, PrimaryButton, RiskBadge, StatusPill } from '@/components/psp/PlatformShell'
import { merchantPortfolio } from '@/lib/psp-platform-data'

export default function PSPMerchantsPage() {
  return (
    <div>
      <PageHeading eyebrow="Merchant Portfolio" title="Merchant Management" description="Manage merchant tiers, KYC state, payout model, volume, success rate, risk score, and monitoring alerts." action={<PrimaryButton><Plus size={15}/> Add Merchant</PrimaryButton>} />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <GlassCard><p className="text-xs text-white/40">Merchants</p><p className="mt-2 text-3xl font-black text-white">{merchantPortfolio.length}</p></GlassCard>
        <GlassCard><p className="text-xs text-white/40">Enterprise</p><p className="mt-2 text-3xl font-black text-white">2</p></GlassCard>
        <GlassCard><p className="text-xs text-white/40">Avg Success</p><p className="mt-2 text-3xl font-black text-white">95.5%</p></GlassCard>
        <GlassCard><p className="text-xs text-white/40">Open Alerts</p><p className="mt-2 text-3xl font-black text-white">8</p></GlassCard>
      </div>
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead><tr className="border-b border-white/10 bg-white/[0.03]">{['Merchant','Tier','KYC','Month Volume','Success','Payout','Risk','Alerts'].map(h=><th key={h} className="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-white/35">{h}</th>)}</tr></thead>
            <tbody>{merchantPortfolio.map(m=>(
              <tr key={m.id} className="border-b border-white/[0.04] hover:bg-white/[0.025]">
                <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold text-black font-black">{m.name[0]}</div><div><p className="font-bold text-white">{m.name}</p><p className="text-xs text-white/35">{m.id} · {m.country}</p></div></div></td>
                <td className="px-5 py-4"><StatusPill status={m.tier}/></td>
                <td className="px-5 py-4"><StatusPill status={m.kyc}/></td>
                <td className="px-5 py-4"><MoneyCell amount={m.volumeMonth}/></td>
                <td className="px-5 py-4 text-sm font-bold text-white">{m.successRate}%</td>
                <td className="px-5 py-4 text-sm text-white/60">{m.payoutMode}</td>
                <td className="px-5 py-4"><RiskBadge score={m.riskScore}/></td>
                <td className="px-5 py-4"><span className="inline-flex items-center gap-2 text-sm text-white/65"><Bell size={14}/>{m.alerts}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </GlassCard>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {merchantPortfolio.slice(0,3).map(m=><GlassCard key={m.id}><div className="flex items-center justify-between"><p className="font-black text-white">{m.name}</p><UserCheck className="text-gold" size={18}/></div><p className="mt-3 text-sm text-white/45">Tier {m.tier}. KYC {m.kyc}. Payout mode {m.payoutMode}. Risk score {m.riskScore}.</p></GlassCard>)}
      </div>
    </div>
  )
}
