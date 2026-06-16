'use client'

import { useState } from 'react'
import { CheckCircle2, FileText, MessageSquare, ShieldAlert, XCircle } from 'lucide-react'
import { PageHeading, GlassCard, MoneyCell, PrimaryButton, RiskBadge, SeverityBadge, SoftButton, StatusPill } from '@/components/psp/PlatformShell'
import { approvals } from '@/lib/psp-platform-data'

export default function ApprovalQueuePage() {
  const [selectedId, setSelectedId] = useState(approvals[0]?.id || '')
  const selected = approvals.find(item => item.id === selectedId) || approvals[0]

  return (
    <div>
      <PageHeading eyebrow="Review Console" title="Approval Queue" description="Priority-based queue for merchant KYC, payouts, high-value transactions, and automated risk flags." action={<PrimaryButton><ShieldAlert size={15}/> Start Review</PrimaryButton>} />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.4fr]">
        <GlassCard className="p-0 overflow-hidden">
          <div className="border-b border-white/10 p-5">
            <h2 className="font-black text-white">Queue</h2>
            <p className="text-sm text-white/40">{approvals.length} items need operational attention</p>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {approvals.map(item => (
              <button key={item.id} onClick={() => setSelectedId(item.id)} className={`block w-full p-5 text-left transition-all ${selectedId === item.id ? 'bg-gold/10' : 'hover:bg-white/[0.025]'}`}>
                <div className="flex items-start justify-between gap-3"><div><p className="font-bold text-white">{item.title}</p><p className="mt-1 text-sm text-white/45">{item.merchant} · {item.category}</p></div><SeverityBadge severity={item.priority}/></div>
                <div className="mt-4 flex items-center gap-2"><RiskBadge score={item.riskScore}/><StatusPill status={item.status}/></div>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold/70">{selected.id}</p>
              <h2 className="mt-2 text-2xl font-black text-white">{selected.title}</h2>
              <p className="mt-1 text-sm text-white/45">{selected.merchant} · Created {selected.createdAt}</p>
            </div>
            <div className="flex gap-2"><SeverityBadge severity={selected.priority}/><RiskBadge score={selected.riskScore}/></div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs text-white/35">Category</p><p className="mt-1 font-bold text-white">{selected.category}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs text-white/35">Amount</p><p className="mt-1 font-bold text-white">{selected.amount ? <MoneyCell amount={selected.amount}/> : 'N/A'}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs text-white/35">Status</p><div className="mt-1"><StatusPill status={selected.status}/></div></div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-black text-white"><FileText size={16}/> Documents</h3>
              <div className="space-y-2">{selected.documents.map(doc => <div key={doc} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/65">{doc}</div>)}</div>
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-black text-white"><MessageSquare size={16}/> Review Notes</h3>
              <div className="space-y-2">{selected.notes.map(note => <div key={note} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/65">{note}</div>)}</div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-5">
            <PrimaryButton><CheckCircle2 size={15}/> Approve</PrimaryButton>
            <SoftButton><XCircle size={15}/> Reject</SoftButton>
            <SoftButton><ShieldAlert size={15}/> Escalate</SoftButton>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
