import { Camera, CheckCircle2, Lock, Upload } from 'lucide-react'
import { GlassCard, PageHeading, PrimaryButton, StatusPill } from '@/components/psp/PlatformShell'
import { kycSteps } from '@/lib/psp-platform-data'

export default function P2PKYCPage() {
  return (
    <div>
      <PageHeading eyebrow="Identity Verification" title="P2P KYC" description="Four-step secure identity verification flow with document upload, selfie/liveness, validation states, and review tracking." />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <GlassCard>
          <h2 className="mb-5 text-xl font-black text-white">Verification Steps</h2>
          <div className="space-y-3">
            {kycSteps.map((step, index) => (
              <div key={step.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${step.status === 'completed' ? 'bg-emerald-500/15 text-emerald-300' : step.status === 'current' ? 'bg-gold/15 text-gold' : 'bg-white/5 text-white/25'}`}>{step.status === 'completed' ? <CheckCircle2/> : step.status === 'current' ? index + 1 : <Lock/>}</div>
                  <div><p className="font-black text-white">{step.title}</p><p className="mt-1 text-sm text-white/45">{step.description}</p><div className="mt-2"><StatusPill status={step.status}/></div></div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h2 className="text-2xl font-black text-white">Selfie / Liveness Check</h2>
          <p className="mt-2 text-sm text-white/45">Capture a clear selfie matching the uploaded ID document. This prepares the flow for a real liveness SDK later.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center"><Upload className="text-gold" size={36}/><p className="mt-4 font-black text-white">Upload ID Document</p><p className="mt-1 text-sm text-white/40">National ID, passport, or residence card</p></div>
            <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center"><Camera className="text-cyan-300" size={36}/><p className="mt-4 font-black text-white">Capture Selfie</p><p className="mt-1 text-sm text-white/40">Face check for account ownership</p></div>
          </div>
          <div className="mt-6 rounded-3xl border border-gold/20 bg-gold/10 p-5"><p className="font-black text-gold">Secure UI Cues</p><p className="mt-2 text-sm text-white/50">All document states are ready for backend validation, audit logs, and compliance notes.</p></div>
          <div className="mt-6"><PrimaryButton>Submit for Review</PrimaryButton></div>
        </GlassCard>
      </div>
    </div>
  )
}
