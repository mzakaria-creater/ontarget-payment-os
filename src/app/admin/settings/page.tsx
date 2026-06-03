'use client'
import { Topbar } from '@/components/layout/Topbar'

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Settings" role="admin" />
      <main className="flex-1 p-6 max-w-2xl space-y-6">
        <div className="rounded-2xl glass p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white mb-4">Platform Settings</h3>
          {[['Platform Name', 'OnTarget Payment OS'], ['Default Currency', 'EGP'], ['Timezone', 'Africa/Cairo (UTC+3)'], ['Language', 'English / Arabic']].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <p className="text-sm text-white/60">{label}</p>
              <p className="text-sm font-medium text-white">{value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl glass p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Security</h3>
          {[['Two-Factor Auth', 'Enabled'], ['Session Timeout', '30 minutes'], ['IP Allowlist', 'Disabled'], ['Audit Logging', 'Enabled']].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <p className="text-sm text-white/60">{label}</p>
              <p className={`text-sm font-medium ${value === 'Enabled' ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
