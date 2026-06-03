'use client'
import { useState, useEffect } from 'react'
import { CreditCard, Copy, Check, Upload, Clock, CheckCircle2, XCircle, ArrowLeft, Shield, Globe } from 'lucide-react'

type Step = 'details' | 'proof' | 'success' | 'declined' | 'expired'

function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds)
  useEffect(() => {
    if (remaining <= 0) return
    const t = setInterval(() => setRemaining(r => r - 1), 1000)
    return () => clearInterval(t)
  }, [remaining])
  const m = Math.floor(remaining / 60).toString().padStart(2, '0')
  const s = (remaining % 60).toString().padStart(2, '0')
  return { remaining, display: `${m}:${s}` }
}

export default function CheckoutPage({ params }: { params: { token: string } }) {
  const [step, setStep] = useState<Step>('details')
  const [copied, setCopied] = useState(false)
  const [lang, setLang] = useState<'en' | 'ar'>('en')
  const [proof, setProof] = useState<File | null>(null)
  const [form, setForm] = useState({ sender_name: '', sender_phone: '', reference: '' })
  const [submitting, setSubmitting] = useState(false)
  const timer = useCountdown(1740) // 29 min

  const isRTL = lang === 'ar'

  const tx = {
    merchant: 'Demo Store',
    amount: 5000,
    currency: 'EGP',
    method: 'Vodafone Cash',
    transaction_id: 'TXN-DEMO0002',
    wallet: { number: '0100****1111', name: 'محمد أحمد', instructions_en: 'Send exactly EGP 5,000.00 to this Vodafone Cash number and keep your transfer receipt.', instructions_ar: 'أرسل مبلغ 5,000.00 جنيه بالضبط على رقم فودافون كاش هذا واحتفظ بإيصال التحويل.' },
  }

  function copy() { navigator.clipboard.writeText('01001111111'); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  function submitProof(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); setStep('success') }, 1200)
  }

  if (timer.remaining === 0 && step === 'details') setStep('expired')

  const t = {
    title:         lang === 'en' ? 'Complete Payment' : 'إتمام الدفع',
    powered:       lang === 'en' ? 'Powered by Press2Pay' : 'مدعوم من Press2Pay',
    amount:        lang === 'en' ? 'Amount Due' : 'المبلغ المطلوب',
    expires:       lang === 'en' ? 'Expires in' : 'تنتهي خلال',
    send_to:       lang === 'en' ? 'Send Payment To' : 'أرسل الدفع إلى',
    copy:          lang === 'en' ? 'Copy' : 'نسخ',
    copied:        lang === 'en' ? 'Copied' : 'تم النسخ',
    instructions:  lang === 'en' ? tx.wallet.instructions_en : tx.wallet.instructions_ar,
    done_send:     lang === 'en' ? 'I\'ve sent the payment →' : 'أرسلت الدفع ←',
    proof_title:   lang === 'en' ? 'Upload Payment Proof' : 'رفع إيصال الدفع',
    sender_name:   lang === 'en' ? 'Your Name' : 'اسمك',
    sender_phone:  lang === 'en' ? 'Your Phone' : 'رقم هاتفك',
    reference:     lang === 'en' ? 'Transfer Reference' : 'رقم المرجع',
    upload:        lang === 'en' ? 'Upload Screenshot / Receipt' : 'رفع لقطة شاشة / إيصال',
    submit:        lang === 'en' ? 'Submit Payment Proof' : 'إرسال إيصال الدفع',
    success_title: lang === 'en' ? 'Payment Submitted!' : 'تم إرسال الدفع!',
    success_sub:   lang === 'en' ? 'Your payment is under review. You\'ll be notified once confirmed.' : 'دفعتك قيد المراجعة. سيتم إخطارك بمجرد التأكيد.',
    back:          lang === 'en' ? 'Return to Merchant' : 'العودة إلى التاجر',
    expired_title: lang === 'en' ? 'Payment Expired' : 'انتهت صلاحية الدفع',
    expired_sub:   lang === 'en' ? 'This payment link has expired. Please contact the merchant for a new link.' : 'انتهت صلاحية رابط الدفع هذا. يرجى التواصل مع التاجر للحصول على رابط جديد.',
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#080808', fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}>

      {/* Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #D4AF37, transparent)' }} />

      <div className="w-full max-w-sm relative z-10 animate-slide-up">

        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-white/40 hover:text-white hover:bg-white/5 transition-all">
              <Globe size={12} />{lang === 'en' ? 'العربية' : 'English'}
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #A88C20)' }}>
                <CreditCard size={11} className="text-black" />
              </div>
              <span className="text-[11px] text-white/30">{t.powered}</span>
            </div>
          </div>
          <h1 className="text-sm font-semibold text-white/60">{tx.merchant}</h1>
        </div>

        {/* STEP: Details */}
        {step === 'details' && (
          <div className="rounded-3xl overflow-hidden" style={{ boxShadow: '0 0 60px rgba(212,175,55,0.1), 0 32px 64px rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.2)', background: 'linear-gradient(135deg, rgba(212,175,55,0.07) 0%, rgba(0,0,0,0.4) 100%)', backdropFilter: 'blur(30px)' }}>

            {/* Amount + timer */}
            <div className="p-6 text-center border-b border-white/5">
              <p className="text-xs text-white/40 mb-2">{t.amount}</p>
              <p className="text-4xl font-bold gradient-text-gold mb-1">{tx.amount.toLocaleString('en-EG')}</p>
              <p className="text-lg text-white/50">{tx.currency}</p>
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <Clock size={12} className={timer.remaining < 300 ? 'text-red-400' : 'text-white/30'} />
                <p className={`text-xs font-mono ${timer.remaining < 300 ? 'text-red-400' : 'text-white/40'}`}>
                  {t.expires} {timer.display}
                </p>
              </div>
            </div>

            {/* Wallet info */}
            <div className="p-6 space-y-4">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">{t.send_to}</p>

              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-white/40">{tx.method}</p>
                  <button onClick={copy}
                    className="flex items-center gap-1 text-xs font-medium transition-all"
                    style={{ color: copied ? '#10B981' : '#D4AF37' }}>
                    {copied ? <><Check size={11} /> {t.copied}</> : <><Copy size={11} /> {t.copy}</>}
                  </button>
                </div>
                <p className="text-2xl font-bold font-mono text-white tracking-wider">01001111111</p>
                <p className="text-sm text-white/50 mt-1">{tx.wallet.name}</p>
              </div>

              <div className="rounded-xl p-3" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <p className="text-xs text-white/50 leading-relaxed">{t.instructions}</p>
              </div>

              <p className="text-[10px] text-white/25 text-center">TX: {tx.transaction_id}</p>

              <button onClick={() => setStep('proof')}
                className="w-full btn-gold rounded-2xl py-3.5 text-sm flex items-center justify-center gap-2">
                {t.done_send}
              </button>
            </div>
          </div>
        )}

        {/* STEP: Upload proof */}
        {step === 'proof' && (
          <div className="rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(30px)' }}>
            <div className="p-5 border-b border-white/5 flex items-center gap-3">
              <button onClick={() => setStep('details')} className="text-white/40 hover:text-white transition-colors">
                <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} />
              </button>
              <p className="text-sm font-semibold text-white">{t.proof_title}</p>
            </div>

            <form onSubmit={submitProof} className="p-5 space-y-4">
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">{t.sender_name}</label>
                <input required value={form.sender_name}
                  onChange={e => setForm(f => ({ ...f, sender_name: e.target.value }))}
                  placeholder={lang === 'en' ? 'Ahmed Mohamed' : 'أحمد محمد'}
                  className="w-full rounded-xl px-4 py-3 text-sm input-dark" />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">{t.sender_phone}</label>
                <input required value={form.sender_phone}
                  onChange={e => setForm(f => ({ ...f, sender_phone: e.target.value }))}
                  placeholder="01000000000"
                  className="w-full rounded-xl px-4 py-3 text-sm input-dark" />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">{t.reference}</label>
                <input required value={form.reference}
                  onChange={e => setForm(f => ({ ...f, reference: e.target.value }))}
                  placeholder="VF-REF-XXXXX"
                  className="w-full rounded-xl px-4 py-3 text-sm input-dark" />
              </div>

              {/* File upload */}
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">{t.upload}</label>
                <label className="flex flex-col items-center justify-center gap-2 py-6 rounded-xl cursor-pointer transition-all"
                  style={{ border: `2px dashed ${proof ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`, background: proof ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)' }}>
                  <input type="file" accept="image/*,application/pdf" className="hidden"
                    onChange={e => setProof(e.target.files?.[0] ?? null)} />
                  {proof
                    ? <><Check size={20} className="text-emerald-400" /><p className="text-xs text-emerald-400 font-medium">{proof.name}</p></>
                    : <><Upload size={20} className="text-white/20" /><p className="text-xs text-white/30">Tap to upload</p></>}
                </label>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full btn-gold rounded-xl py-3 text-sm flex items-center justify-center gap-2">
                {submitting
                  ? <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                  : t.submit}
              </button>
            </form>
          </div>
        )}

        {/* STEP: Success */}
        {step === 'success' && (
          <div className="rounded-3xl p-8 text-center" style={{ border: '1px solid rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.05)', backdropFilter: 'blur(30px)' }}>
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
              style={{ background: 'rgba(16,185,129,0.12)' }}>
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{t.success_title}</h2>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">{t.success_sub}</p>
            <div className="rounded-xl p-4 mb-6 text-left" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {[['Merchant', tx.merchant], ['Amount', `${tx.amount.toLocaleString()} ${tx.currency}`], ['Transaction', tx.transaction_id], ['Status', 'Under Review']].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs text-white/40">{label}</span>
                  <span className="text-xs font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {t.back}
            </button>
          </div>
        )}

        {/* STEP: Expired */}
        {step === 'expired' && (
          <div className="rounded-3xl p-8 text-center" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(30px)' }}>
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              <XCircle size={32} className="text-white/30" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{t.expired_title}</h2>
            <p className="text-sm text-white/40 leading-relaxed">{t.expired_sub}</p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-[10px] text-white/20 mt-4 flex items-center justify-center gap-1">
          <Shield size={9} /> Secured by Press2Pay · All transactions encrypted
        </p>
      </div>
    </div>
  )
}
