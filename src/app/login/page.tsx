'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<'admin' | 'merchant'>('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push(role === 'admin' ? '/admin/dashboard' : '/merchant/dashboard')
    }, 800)
  }

  function quickLogin(r: 'admin' | 'merchant') {
    setRole(r)
    setLoading(true)
    setTimeout(() => {
      router.push(r === 'admin' ? '/admin/dashboard' : '/merchant/dashboard')
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#080808' }}>

      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />

      {/* Card */}
      <div className="w-full max-w-sm animate-slide-up">
        <div className="rounded-3xl p-8 glass-dark"
          style={{ boxShadow: '0 0 60px rgba(212,175,55,0.08), 0 32px 64px rgba(0,0,0,0.5)' }}>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #A88C20)' }}>
              <CreditCard size={24} className="text-black" />
            </div>
            <h1 className="text-xl font-bold gradient-text-gold">OnTarget</h1>
            <p className="text-sm text-white/40 mt-1">Payment OS · Press2Pay</p>
          </div>

          {/* Role tabs */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {(['admin', 'merchant'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={role === r
                  ? { background: 'linear-gradient(135deg, #D4AF37, #A88C20)', color: '#000' }
                  : { color: 'rgba(255,255,255,0.4)' }}>
                {r === 'admin' ? '🛡 Admin' : '🏪 Merchant'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-white/40 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={role === 'admin' ? 'admin@ontarget.io' : 'merchant@demo.com'}
                className="w-full rounded-xl px-4 py-3 text-sm input-dark"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-white/40 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 text-sm input-dark pr-11"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-gold rounded-xl py-3 text-sm flex items-center justify-center gap-2 mt-2">
              {loading
                ? <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                : <><span>Sign In</span><ArrowRight size={15} /></>}
            </button>
          </form>

          {/* Demo shortcuts */}
          <div className="mt-6 pt-5 border-t border-white/5">
            <p className="text-[11px] text-white/30 text-center mb-3">Demo — quick access</p>
            <div className="flex gap-2">
              <button onClick={() => quickLogin('admin')}
                className="flex-1 text-xs py-2 rounded-lg font-medium transition-all"
                style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                Admin Demo
              </button>
              <button onClick={() => quickLogin('merchant')}
                className="flex-1 text-xs py-2 rounded-lg font-medium transition-all"
                style={{ background: 'rgba(124,58,237,0.08)', color: '#9F67FF', border: '1px solid rgba(124,58,237,0.2)' }}>
                Merchant Demo
              </button>
            </div>
          </div>

          {/* Security note */}
          <p className="text-[10px] text-white/20 text-center mt-5 flex items-center justify-center gap-1">
            <Shield size={10} /> Secured · All data encrypted in transit
          </p>
        </div>
      </div>
    </div>
  )
}
