'use client'
import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Key, Copy, Plus, Trash2, Check } from 'lucide-react'

const INITIAL_KEYS = [
  { id: 1, prefix: 'ontarget_live_demo', label: 'Live Key', status: 'active', lastUsed: '2026-06-03 12:00' },
  { id: 2, prefix: 'ontarget_test_demo', label: 'Test Key', status: 'active', lastUsed: '2026-06-01 09:30' },
]

export default function ApiKeysPage() {
  const [keys, setKeys] = useState(INITIAL_KEYS)
  const [copied, setCopied] = useState<number | null>(null)
  const [created, setCreated] = useState(false)

  function copy(id: number) {
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  function revoke(id: number) {
    setKeys(k => k.filter(key => key.id !== id))
  }

  function createKey() {
    const newKey = { id: Date.now(), prefix: 'ontarget_live_new', label: 'New Key', status: 'active', lastUsed: 'Never' }
    setKeys(k => [...k, newKey])
    setCreated(true)
    setTimeout(() => setCreated(false), 3000)
  }

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="API Keys" subtitle="Manage your integration credentials" role="merchant" />
      <main className="flex-1 p-6 space-y-5 max-w-2xl">

        <div className="flex justify-between items-center">
          <p className="text-sm text-white/40">{keys.length} active key{keys.length !== 1 ? 's' : ''}</p>
          <button onClick={createKey}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold btn-gold">
            <Plus size={15} /> Create Key
          </button>
        </div>

        {created && (
          <div className="rounded-xl p-4 flex items-center gap-3 animate-slide-up"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <Check size={16} className="text-emerald-400" />
            <p className="text-sm text-emerald-400">New API key created. Copy it now — it won't be shown again.</p>
          </div>
        )}

        <div className="space-y-3">
          {keys.map(key => (
            <div key={key.id} className="rounded-2xl glass p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(212,175,55,0.1)' }}>
                    <Key size={15} style={{ color: '#D4AF37' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{key.label}</p>
                    <p className="text-xs text-white/35">Last used: {key.lastUsed}</p>
                  </div>
                </div>
                <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-xl px-3 py-2.5 font-mono text-sm text-white/50"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {key.prefix}{'·'.repeat(24)}
                </div>
                <button onClick={() => copy(key.id)}
                  className="p-2.5 rounded-xl transition-all"
                  style={{ background: copied === key.id ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {copied === key.id
                    ? <Check size={14} className="text-emerald-400" />
                    : <Copy size={14} className="text-white/40" />}
                </button>
                <button onClick={() => revoke(key.id)}
                  className="p-2.5 rounded-xl text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl glass p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Usage Example</h3>
          <div className="rounded-xl p-3 font-mono text-xs text-white/50 overflow-x-auto"
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {`curl -X POST https://your.domain/api/create-payment \\
  -H "x-api-key: ontarget_live_demo......" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 5000,
    "currency": "EGP",
    "type": "deposit",
    "method": "vodafone_cash",
    "merchant_order_id": "ORD-1234"
  }'`}
          </div>
        </div>
      </main>
    </div>
  )
}
