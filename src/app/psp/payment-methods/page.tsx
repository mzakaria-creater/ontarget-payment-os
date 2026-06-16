import { CreditCard, ToggleLeft, ToggleRight } from 'lucide-react'
import { PageHeading, GlassCard, MoneyCell, PrimaryButton, StatusPill } from '@/components/psp/PlatformShell'
import { paymentMethods } from '@/lib/psp-platform-data'

export default function PaymentMethodsPage() {
  return (
    <div>
      <PageHeading eyebrow="Rail Configuration" title="Payment Methods" description="Configure e-wallets, banks, cards, crypto, cash collection, fees, limits, availability, and settlement behavior." action={<PrimaryButton><CreditCard size={15}/> Add Method</PrimaryButton>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {paymentMethods.map(method => {
          const usedPct = Math.round((method.usedToday / method.dailyLimit) * 100)
          return (
            <GlassCard key={method.id}>
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-lg font-black text-white">{method.name}</p><p className="mt-1 text-sm text-white/40">{method.type} · {method.id}</p></div>
                <div className="flex items-center gap-2"><StatusPill status={method.status}/>{method.status === 'active' ? <ToggleRight className="text-emerald-300"/> : <ToggleLeft className="text-white/30"/>}</div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/[0.03] p-3"><p className="text-xs text-white/35">Pay-in Fee</p><p className="font-black text-white">{method.feePayin}%</p></div>
                <div className="rounded-2xl bg-white/[0.03] p-3"><p className="text-xs text-white/35">Payout Fee</p><p className="font-black text-white">{method.feePayout}%</p></div>
                <div className="rounded-2xl bg-white/[0.03] p-3"><p className="text-xs text-white/35">Success</p><p className="font-black text-white">{method.successRate}%</p></div>
                <div className="rounded-2xl bg-white/[0.03] p-3"><p className="text-xs text-white/35">Settlement</p><p className="font-black text-white text-sm">{method.settlement}</p></div>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs"><span className="text-white/40">Daily Limit</span><span className="font-bold text-white">{usedPct}%</span></div>
                <div className="h-2 rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-gold to-purple-500" style={{ width: `${usedPct}%` }}/></div>
                <div className="mt-2 flex justify-between text-[11px] text-white/35"><span><MoneyCell amount={method.usedToday}/></span><span><MoneyCell amount={method.dailyLimit}/></span></div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
