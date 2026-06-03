'use client'
import Link from 'next/link'
import { Bell, Globe, LogOut } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
  role: 'admin' | 'merchant'
}

export function Topbar({ title, subtitle, role }: TopbarProps) {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/5"
      style={{ background: 'rgba(8,8,8,0.8)', backdropFilter: 'blur(20px)' }}>
      <div>
        <h1 className="text-sm font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-[11px] text-white/35">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all">
          <Globe size={13} />
          EN
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D4AF37]" />
        </button>

        {/* Sign out */}
        <Link href="/login"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all">
          <LogOut size={13} />
          <span>Sign out</span>
        </Link>
      </div>
    </header>
  )
}
