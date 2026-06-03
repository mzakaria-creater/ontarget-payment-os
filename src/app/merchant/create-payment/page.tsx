'use client'
import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Copy, Check, QrCode, ArrowRight } from 'lucide-react'

const METHODS = ['Vodafone Cash', 'Orange Cash', 'Etisalat Cash', 'WE Pay', 'InstaPay', 'Bank Transfer', 'Fawry', 'USDT (TRC20)']
const CURRENCIES = ['EGP', 'USD', 'EUR', 'USDT']

export default function CreatePaymentPage() {
  const [form, setForm] = useState({
    amount: '', currency: 'EGP', type: 'deposit',
    customer_name: '', customer_phone: '', method: '', order_id: '',
  })
  const [created, setCreated] = useState(false)
  const [copied, setCopied] = useState(false)
  const checkoutUrl = 'https://pay.ontarget.io/checkout/demo-tok-xYz7kN2mPq'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCreated(true)
  }

  function copy() {
    navigator.clipboard.writeText(checkoutUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Create Payment" subtitle="Generate a checkout link for your customer" role="merchant" />
      <main className="flex-1 p-6">
        <div className="max-w-xl mx-auto space-y-5">

          {!created ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-2xl glass p-6 space-y-5">
                <h3 className="text-sm font-semibold text-white">Payment Details</h3>

                {/* Type */}
                <div>
                  <label className="text-xs font-medium text-white/40 mb-2 block">Type</label>
                  <div className="flex rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {['deposit', 'payout'].map(t => (
                      <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                        className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
                        style={form.type === t
                          ? { background: 'linear-gradient(135deg, #D4AF37, #A88C20)', color: '#000' }
                          : { color: 'rgba(255,255,255,0.4)' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount + Currency */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-white/40 mb-1.5 block">Amount</label>
                    <input type="number" required placeholder="0.00"
                      value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-sm input-dark" />
                  </div>
                  <div className="w-28">
                    <label className="text-xs font-medium text-white/40 mb-1.5 block">Currency</label>
                    <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                      className="w-full rounded-xl px-3 py-3 text-sm input-dark">
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Method */}
                <div>
                  <label className="text-xs font-medium text-white/40 mb-1.5 block">Payment Method</label>
                  <select required value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-sm input-dark">
                    <option value="">Select method…</option>
                    {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Customer */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-white/40 mb-1.5 block">Customer Name</label>
                    <input placeholder="Ahmed Mohamed" value={form.customer_name}
                      onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-sm input-dark" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white/40 mb-1.5 block">Customer Phone</label>
                    <input placeholder="01000000000" value={form.customer_phone}
                      onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-sm input-dark" />
                  </div>
                </div>

                {/* Order ID */}
                <div>
                  <label className="text-xs font-medium text-white/40 mb-1.5 block">Order ID <span className="text-white/20">(optional)</span></label>
                  <input placeholder="ORD-1234" value={form.order_id}
                    onChange={e => setForm(f => ({ ...f, order_id: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-sm input-dark" />
                </div>

                <button type="submit"
                  className="w-full btn-gold rounded-xl py-3 text-sm flex items-center justify-center gap-2">
                  Generate Checkout Link <ArrowRight size={15} />
                </button>
              </div>
            </form>
          ) : (
            <div className="animate-slide-up space-y-4">
              <div className="rounded-2xl glass-gold p-6 text-center">
                <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3"
                  style={{ background: 'rgba(212,175,55,0.15)' }}>
                  <Check size={22} style={{ color: '#D4AF37' }} />
                </div>
                <p className="text-base font-semibold text-white">Payment Created</p>
                <p className="text-xs text-white/40 mt-1">Share the link below with your customer</p>
              </div>

              <div className="rounded-2xl glass p-5 space-y-4">
                <div>
                  <p className="text-xs text-white/40 mb-2">Checkout Link</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-xl px-3 py-2.5 text-xs font-mono text-white/60 truncate"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {checkoutUrl}
                    </div>
                    <button onClick={copy}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
                      style={{ background: copied ? 'rgba(16,185,129,0.12)' : 'rgba(212,175,55,0.1)', color: copied ? '#10B981' : '#D4AF37', border: `1px solid ${copied ? 'rgba(16,185,129,0.2)' : 'rgba(212,175,55,0.2)'}` }}>
                      {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <QrCode size={36} className="text-white/30" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">Amount</span>
                      <span className="text-xs font-semibold text-white">{form.amount} {form.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">Method</span>
                      <span className="text-xs text-white/70">{form.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">Expires</span>
                      <span className="text-xs text-amber-400">30 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">Status</span>
                      <span className="text-xs font-semibold text-blue-400">Created</span>
                    </div>
                  </div>
                </div>

                <button onClick={() => setCreated(false)}
                  className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Create Another Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
