'use client'

import { useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { GlassCard, PageHeading, PrimaryButton, SoftButton, StatusPill } from '@/components/psp/PlatformShell'

const steps = ['Recipient', 'Amount', 'Review', 'Receipt']

export default function P2PSendMoneyPage() {
  const [step, setStep] = useState(0)
  const fee = 12.5
  const amount = 5000
  return (
    <div>
      <PageHeading eyebrow="Multi-step Payment" title="P2P Send Money" description="Recipient entry, amount, payment method, review screen, fee estimate, confirmation, and receipt states." />
      <GlassCard>
        <div className="mb-8 grid gap-3 md:grid-cols-4">
          {steps.map((label, index) => <div key={label} className={`rounded-2xl border p-4 ${index <= step ? 'border-gold/25 bg-gold/10 text-gold' : 'border-white/10 bg-white/[0.03] text-white/35'}`}><p className="text-xs font-bold">Step {index + 1}</p><p className="mt-1 font-black">{label}</p></div>)}
        </div>
        {step === 0 && <div className="grid gap-4 md:grid-cols-2"><input className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none" placeholder="Recipient phone or wallet ID" defaultValue="0100 223 8891"/><input className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none" placeholder="Recipient name" defaultValue="Ahmed Mahmoud"/></div>}
        {step === 1 && <div className="grid gap-4 md:grid-cols-2"><input className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none" placeholder="Amount" defaultValue="5,000 EGP"/><select className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none"><option>Vodafone Cash</option><option>Orange Cash</option><option>InstaPay</option></select></div>}
        {step === 2 && <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"><h2 className="text-xl font-black text-white">Review Transfer</h2><div className="mt-5 grid gap-3 md:grid-cols-3"><div><p className="text-xs text-white/35">Amount</p><p className="text-lg font-black text-white">{amount.toLocaleString()} EGP</p></div><div><p className="text-xs text-white/35">Fee</p><p className="text-lg font-black text-white">{fee} EGP</p></div><div><p className="text-xs text-white/35">Total</p><p className="text-lg font-black text-gold">{(amount + fee).toLocaleString()} EGP</p></div></div></div>}
        {step === 3 && <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center"><CheckCircle2 className="mx-auto text-emerald-300" size={48}/><h2 className="mt-4 text-2xl font-black text-white">Transfer Created</h2><p className="mt-2 text-white/50">Receipt P2P-RCPT-20260609-001 is ready for export.</p><div className="mt-4"><StatusPill status="Pending Confirmation"/></div></div>}
        <div className="mt-8 flex justify-between border-t border-white/10 pt-5"><SoftButton><button onClick={() => setStep(Math.max(0, step - 1))}>Back</button></SoftButton><PrimaryButton><button onClick={() => setStep(Math.min(3, step + 1))}>{step === 2 ? 'Confirm' : step === 3 ? 'Done' : 'Next'} <Send size={15}/></button></PrimaryButton></div>
      </GlassCard>
    </div>
  )
}
