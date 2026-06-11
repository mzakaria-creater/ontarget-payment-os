'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import {
  Activity, AlertTriangle, BadgeCheck, Banknote, BarChart3, Building2, CheckCircle2,
  Clock, CreditCard, FileCheck2, Fingerprint, History, LayoutDashboard, ListFilter,
  Menu, RefreshCcw, Search, Send, ShieldCheck, Store, UserCheck, Wallet, Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Severity, formatPlatformMoney, riskTone } from '@/lib/psp-platform-data'

const coreNav = [
  { label: 'Enterprise Dashboard', href: '/psp/dashboard', icon: LayoutDashboard },
  { label: 'Operations', href: '/psp/operations', icon: ListFilter },
  { label: 'Approval Queue', href: '/psp/approvals', icon: FileCheck2 },
  { label: 'Merchants', href: '/psp/merchants', icon: Building2 },
  { label: 'Payment Methods', href: '/psp/payment-methods', icon: CreditCard },
  { label: 'Wallets & Accounts', href: '/psp/wallets-accounts', icon: Wallet },
]

const p2pNav = [
  { label: 'P2P Hub', href: '/p2p/hub', icon: Store },
  { label: 'Send Money', href: '/p2p/send', icon: Send },
  { label: 'Marketplace', href: '/p2p/marketplace', icon: Banknote },
  { label: 'P2P KYC', href: '/p2p/kyc', icon: Fingerprint },
  { label: 'P2P History', href: '/p2p/history', icon: History },
]

export function PlatformShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const renderLink = (item: typeof coreNav[number]) => {
    const Icon = item.icon
    const active = pathname === item.href
    return (
      <Link key={item.href} href={item.href} className={cn(
        'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all',
        active ? 'bg-gold/10 text-gold border border-gold/20 shadow-[0_0_24px_rgba(212,175,55,0.08)]' : 'text-white/50 hover:bg-white/5 hover:text-white'
      )}>
        <Icon size={16} />
        <span>{item.label}</span>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute top-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-purple-600/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <aside className="fixed left-0 top-0 z-40 hidden h-full w-[280px] flex-col border-r border-white/10 bg-black/70 p-4 backdrop-blur-2xl lg:flex">
        <Link href="/psp/dashboard" className="mb-6 flex items-center gap-3 rounded-3xl border border-gold/20 bg-gold/10 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-gold-dark text-black">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-base font-black gradient-text-gold">OnTarget</p>
            <p className="text-xs text-white/45">PSP Platform</p>
          </div>
        </Link>

        <div className="space-y-6 overflow-y-auto pb-6">
          <div>
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">Core PSP</p>
            <nav className="space-y-1">{coreNav.map(renderLink)}</nav>
          </div>
          <div>
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">P2P System</p>
            <nav className="space-y-1">{p2pNav.map(renderLink)}</nav>
          </div>
        </div>

        <div className="mt-auto rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Production Ready
          </div>
          <p className="text-xs leading-5 text-white/40">React UI, Next API routes, Supabase-ready data shape, n8n webhook-ready operations.</p>
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#080808]/75 px-4 backdrop-blur-2xl md:px-8">
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/60 lg:hidden">
              <Menu size={18} />
            </button>
            <div>
              <p className="text-sm font-semibold text-white">OnTarget Payment Service Provider</p>
              <p className="text-xs text-white/35">Egypt & MENA payment operations console</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 md:flex">
            <Search size={14} className="text-white/35" />
            <span className="text-xs text-white/35">Search TX, wallet, merchant, reference</span>
          </div>
        </header>
        <main className="relative p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}

export function PageHeading({ title, eyebrow, description, action }: { title: string; eyebrow?: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-gold/70">{eyebrow}</p>}
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl', className)}>{children}</div>
}

export function MetricTile({ label, value, sub, tone = 'gold', icon }: { label: string; value: string; sub?: string; tone?: 'gold' | 'purple' | 'green' | 'blue' | 'red'; icon?: ReactNode }) {
  const tones = {
    gold: 'from-gold/20 to-gold/5 text-gold border-gold/20',
    purple: 'from-purple-500/20 to-purple-500/5 text-purple-300 border-purple-500/20',
    green: 'from-emerald-500/20 to-emerald-500/5 text-emerald-300 border-emerald-500/20',
    blue: 'from-cyan-500/20 to-cyan-500/5 text-cyan-300 border-cyan-500/20',
    red: 'from-red-500/20 to-red-500/5 text-red-300 border-red-500/20',
  }
  return (
    <GlassCard className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br opacity-80" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-white/40">{label}</p>
          <p className="mt-2 text-2xl font-black text-white">{value}</p>
          {sub && <p className="mt-1 text-xs text-white/35">{sub}</p>}
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl border bg-gradient-to-br', tones[tone])}>{icon || <Activity size={18} />}</div>
      </div>
    </GlassCard>
  )
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const cls = {
    critical: 'border-red-500/30 bg-red-500/10 text-red-300',
    high: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    medium: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    low: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  }[severity]
  return <span className={cn('rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize', cls)}>{severity}</span>
}

export function RiskBadge({ score }: { score: number }) {
  return <span className={cn('rounded-full border px-2.5 py-1 text-[11px] font-bold', riskTone(score))}>Risk {score}</span>
}

export function StatusPill({ status }: { status: string }) {
  const lower = status.toLowerCase()
  const cls = lower.includes('approved') || lower.includes('matched') || lower.includes('completed') || lower.includes('active') || lower.includes('online')
    ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
    : lower.includes('pending') || lower.includes('review') || lower.includes('processing') || lower.includes('limited') || lower.includes('current')
      ? 'border-amber-500/25 bg-amber-500/10 text-amber-300'
      : lower.includes('failed') || lower.includes('rejected') || lower.includes('disabled') || lower.includes('offline')
        ? 'border-red-500/25 bg-red-500/10 text-red-300'
        : 'border-white/10 bg-white/5 text-white/50'
  return <span className={cn('rounded-full border px-2.5 py-1 text-[11px] font-bold', cls)}>{status}</span>
}

export function PrimaryButton({ children }: { children: ReactNode }) {
  return <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gold to-gold-dark px-4 py-2.5 text-sm font-black text-black shadow-lg shadow-gold/10">{children}</button>
}

export function SoftButton({ children }: { children: ReactNode }) {
  return <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10">{children}</button>
}

export function MoneyCell({ amount, currency }: { amount: number; currency?: string }) {
  return <span className="font-bold text-white">{formatPlatformMoney(amount, currency)}</span>
}

export const icons = { AlertTriangle, BadgeCheck, BarChart3, CheckCircle2, Clock, RefreshCcw, Zap }
