'use client'
import { Topbar } from '@/components/layout/Topbar'

export default function MerchantSettingsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Settings" role="merchant" />
      <main className="flex-1 p-6 max-w-2xl space-y-5">
        <div className="rounded-2xl glass p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white mb-2">Business Info</h3>
          {[['Merchant Name', 'Demo Store'], ['Business Name', 'Demo Store LLC'], ['Email', 'merchant@demo.com'], ['Phone', '01000000001'], ['Code', 'DEMO001'], ['Currency', 'EGP']].map(([label, value]) => (
            <div key={label} className="flex justify-between py-3 border-b border-white/5 last:border-0">
              <p className="text-sm text-white/50">{label}</p>
              <p className="text-sm font-medium text-white">{value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl glass p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Webhook</h3>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Callback URL</label>
            <input defaultValue="https://demo.example.com/callback" className="w-full rounded-xl px-4 py-3 text-sm input-dark" />
          </div>
        </div>
      </main>
    </div>
  )
}
