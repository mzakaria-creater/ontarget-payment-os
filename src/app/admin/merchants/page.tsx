'use client'
import { Topbar } from '@/components/layout/Topbar'
import { MerchantStatusBadge } from '@/components/ui/StatusBadge'
import { MERCHANTS } from '@/lib/mock-data'
import { formatAmount } from '@/lib/utils'
import { Building2, Plus, MoreHorizontal } from 'lucide-react'

export default function MerchantsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Merchants" subtitle="Manage merchant accounts" role="admin" />
      <main className="flex-1 p-6 space-y-5">

        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold btn-gold">
            <Plus size={15} /> Add Merchant
          </button>
        </div>

        <div className="rounded-2xl glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Merchant', 'Code', 'Contact', 'Currency', 'Today Volume', 'Monthly', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-white/35 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MERCHANTS.map(m => (
                  <tr key={m.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #D4AF37, #A88C20)' }}>
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{m.name}</p>
                          <p className="text-[11px] text-white/35">{m.business_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-white/50">{m.code}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-white/70">{m.email}</p>
                      <p className="text-xs text-white/35">{m.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-white/60">{m.currency}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-white">{formatAmount(m.volume_today)}</td>
                    <td className="px-5 py-4 text-sm text-white/70">{formatAmount(m.volume_month)}</td>
                    <td className="px-5 py-4"><MerchantStatusBadge status={m.status} /></td>
                    <td className="px-5 py-4">
                      <button className="text-white/30 hover:text-white/60 transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
