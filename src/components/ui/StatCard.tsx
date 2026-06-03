'use client'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  accent?: 'gold' | 'green' | 'red' | 'purple' | 'blue'
  className?: string
}

const accentMap = {
  gold:   'from-[rgba(212,175,55,0.12)] to-transparent border-[rgba(212,175,55,0.2)]',
  green:  'from-[rgba(16,185,129,0.1)] to-transparent border-[rgba(16,185,129,0.15)]',
  red:    'from-[rgba(239,68,68,0.1)] to-transparent border-[rgba(239,68,68,0.15)]',
  purple: 'from-[rgba(124,58,237,0.12)] to-transparent border-[rgba(124,58,237,0.2)]',
  blue:   'from-[rgba(59,130,246,0.1)] to-transparent border-[rgba(59,130,246,0.15)]',
}

const iconBg = {
  gold:   'bg-[rgba(212,175,55,0.12)] text-[#D4AF37]',
  green:  'bg-[rgba(16,185,129,0.12)] text-emerald-400',
  red:    'bg-[rgba(239,68,68,0.12)] text-red-400',
  purple: 'bg-[rgba(124,58,237,0.12)] text-purple-400',
  blue:   'bg-[rgba(59,130,246,0.12)] text-blue-400',
}

export function StatCard({ label, value, sub, icon, trend, trendValue, accent = 'gold', className }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-2xl p-5 bg-gradient-to-br border',
      accentMap[accent],
      'backdrop-blur-xl',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white/45 uppercase tracking-wider mb-2">{label}</p>
          <p className="text-2xl font-bold text-white truncate">{value}</p>
          {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
          {trend && trendValue && (
            <p className={cn(
              'text-xs font-medium mt-2',
              trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-white/40'
            )}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-3', iconBg[accent])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
