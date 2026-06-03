'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Zap, List, Wallet, Building2, Terminal,
  BarChart3, Settings, Key, PlusCircle, FileText, CreditCard
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
}

const adminNav: NavItem[] = [
  { label: 'Dashboard',    href: '/admin/dashboard',   icon: <LayoutDashboard size={16} /> },
  { label: 'Live Queue',   href: '/admin/live-queue',  icon: <Zap size={16} />, badge: 3 },
  { label: 'Transactions', href: '/admin/transactions',icon: <List size={16} /> },
  { label: 'Wallets',      href: '/admin/wallets',     icon: <Wallet size={16} /> },
  { label: 'Merchants',    href: '/admin/merchants',   icon: <Building2 size={16} /> },
  { label: 'Raw Events',   href: '/admin/raw-events',  icon: <Terminal size={16} /> },
  { label: 'Reports',      href: '/admin/reports',     icon: <BarChart3 size={16} /> },
  { label: 'Settings',     href: '/admin/settings',    icon: <Settings size={16} /> },
]

const merchantNav: NavItem[] = [
  { label: 'Dashboard',      href: '/merchant/dashboard',       icon: <LayoutDashboard size={16} /> },
  { label: 'Transactions',   href: '/merchant/transactions',    icon: <List size={16} /> },
  { label: 'Create Payment', href: '/merchant/create-payment',  icon: <PlusCircle size={16} /> },
  { label: 'Settlements',    href: '/merchant/settlements',     icon: <FileText size={16} /> },
  { label: 'API Keys',       href: '/merchant/api-keys',        icon: <Key size={16} /> },
  { label: 'Reports',        href: '/merchant/reports',         icon: <BarChart3 size={16} /> },
  { label: 'Settings',       href: '/merchant/settings',        icon: <Settings size={16} /> },
]

export function Sidebar({ role }: { role: 'admin' | 'merchant' }) {
  const pathname = usePathname()
  const nav = role === 'admin' ? adminNav : merchantNav

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] z-40 flex flex-col"
      style={{ background: 'rgba(6,6,6,0.95)', borderRight: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>

      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #A88C20)' }}>
            <CreditCard size={16} className="text-black" />
          </div>
          <div>
            <p className="text-sm font-bold gradient-text-gold leading-none">OnTarget</p>
            <p className="text-[10px] text-white/35 leading-none mt-0.5">Payment OS</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto sidebar-scroll space-y-0.5">
        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-2 mb-3">
          {role === 'admin' ? 'Admin' : 'Merchant'}
        </p>
        {nav.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}
              className={cn('sidebar-item', active && 'active')}>
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37' }}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #A88C20)' }}>
            {role === 'admin' ? 'AD' : 'ME'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{role === 'admin' ? 'Admin User' : 'Demo Store'}</p>
            <p className="text-[10px] text-white/35 truncate">{role === 'admin' ? 'admin@ontarget.io' : 'merchant@demo.com'}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
