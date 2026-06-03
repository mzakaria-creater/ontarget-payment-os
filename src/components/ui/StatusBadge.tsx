'use client'
import { STATUS_LABELS, type TxStatus } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function StatusBadge({ status, className }: { status: TxStatus; className?: string }) {
  const s = STATUS_LABELS[status]
  return (
    <span className={cn('badge', s.cls, className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 inline-block" />
      {s.en}
    </span>
  )
}

export function WalletStatusBadge({ status }: { status: 'active' | 'paused' | 'full' }) {
  const map = {
    active: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    paused: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    full:   'bg-red-500/10 text-red-400 border border-red-500/20',
  }
  return (
    <span className={cn('badge', map[status])}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 inline-block" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export function MerchantStatusBadge({ status }: { status: 'active' | 'paused' | 'suspended' }) {
  const map = {
    active:    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    paused:    'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    suspended: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }
  return (
    <span className={cn('badge', map[status])}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 inline-block" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export function SourceBadge({ source }: { source: string }) {
  const map: Record<string, string> = {
    sms:     'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    email:   'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    binance: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    n8n:     'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    manual:  'bg-white/5 text-white/50 border border-white/10',
  }
  return (
    <span className={cn('badge', map[source] ?? map.manual)}>
      {source.toUpperCase()}
    </span>
  )
}

export function EventStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    matched:   'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    received:  'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    parsed:    'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    failed:    'bg-red-500/10 text-red-400 border border-red-500/20',
    duplicate: 'bg-white/5 text-white/35 border border-white/10',
  }
  return (
    <span className={cn('badge', map[status] ?? map.received)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
