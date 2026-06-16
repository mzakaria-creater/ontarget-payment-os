import { ArrowUpRight, Landmark, Plus, Wallet } from 'lucide-react'
import { PageHeading, GlassCard, MoneyCell, PrimaryButton, SoftButton, StatusPill } from '@/components/psp/PlatformShell'
import { financialAccounts } from '@/lib/psp-platform-data'

export default function WalletsAccountsPage() {
  const total = financialAccounts.reduce((sum, account) => sum + account.total, 0)
  const available = financialAccounts.reduce((sum, account) => sum + account.available, 0)
  const locked = financialAccounts.reduce((sum, account) => sum + account.locked, 0)

  return (
    <div>
      <PageHeading eyebrow="Treasury Console" title="Wallets & Accounts" description="Monitor settlement wallets, operating accounts, reserve balances, crypto treasury, available balance, locked funds, and transfer capacity." action={<PrimaryButton><Plus size={15}/> Add Account</PrimaryButton>} />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <GlassCard><p className="text-xs text-white/40">Total Balance</p><p className="mt-2 text-3xl font-black text-white"><MoneyCell amount={total}/></p></GlassCard>
        <GlassCard><p className="text-xs text-white/40">Available</p><p className="mt-2 text-3xl font-black text-emerald-300"><MoneyCell amount={available}/></p></GlassCard>
        <GlassCard><p className="text-xs text-white/40">Locked / Reserve</p><p className="mt-2 text-3xl font-black text-amber-300"><MoneyCell amount={locked}/></p></GlassCard>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {financialAccounts.map(account => {
          const usedPct = Math.round((account.usedToday / account.dailyLimit) * 100)
          return (
            <GlassCard key={account.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">{account.type === 'Settlement' ? <Landmark/> : <Wallet/>}</div>
                  <div><p className="text-lg font-black text-white">{account.label}</p><p className="text-sm text-white/40">{account.provider} · {account.account}</p></div>
                </div>
                <StatusPill status={account.type}/>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/[0.03] p-3"><p className="text-xs text-white/35">Total</p><p className="font-black text-white"><MoneyCell amount={account.total} currency={account.currency}/></p></div>
                <div className="rounded-2xl bg-white/[0.03] p-3"><p className="text-xs text-white/35">Available</p><p className="font-black text-emerald-300"><MoneyCell amount={account.available} currency={account.currency}/></p></div>
                <div className="rounded-2xl bg-white/[0.03] p-3"><p className="text-xs text-white/35">Locked</p><p className="font-black text-amber-300"><MoneyCell amount={account.locked} currency={account.currency}/></p></div>
              </div>
              <div className="mt-5"><div className="mb-2 flex justify-between text-xs"><span className="text-white/40">Daily usage</span><span className="text-white/70">{usedPct}%</span></div><div className="h-2 rounded-full bg-white/5"><div className="h-full rounded-full bg-gold" style={{ width: `${usedPct}%` }}/></div></div>
              <div className="mt-5 flex flex-wrap gap-2"><SoftButton><ArrowUpRight size={14}/> Transfer</SoftButton><SoftButton>View ledger</SoftButton></div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
