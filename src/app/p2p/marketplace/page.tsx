'use client'

import { useMemo, useState } from 'react'
import { BadgeCheck, Search, Star } from 'lucide-react'
import { GlassCard, PageHeading, PrimaryButton, StatusPill } from '@/components/psp/PlatformShell'
import { p2pOffers } from '@/lib/psp-platform-data'

export default function P2PMarketplacePage() {
  const [side, setSide] = useState('All')
  const offers = useMemo(() => p2pOffers.filter(offer => side === 'All' || offer.side === side), [side])
  return (
    <div>
      <PageHeading eyebrow="Offer Marketplace" title="P2P Marketplace" description="Browse verified offers with ratings, completion rate, rate information, limits, and supported payment methods." />
      <GlassCard className="mb-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"/><input className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-white outline-none" placeholder="Search trader, method, asset…"/></div>
          <div className="flex gap-2">{['All','Buy','Sell'].map(item => <button key={item} onClick={() => setSide(item)} className={`rounded-2xl px-4 py-2 text-sm font-bold ${side === item ? 'bg-gold text-black' : 'border border-white/10 bg-white/5 text-white/55'}`}>{item}</button>)}</div>
        </div>
      </GlassCard>
      <div className="grid gap-4 xl:grid-cols-2">
        {offers.map(offer => (
          <GlassCard key={offer.id}>
            <div className="flex items-start justify-between gap-4">
              <div><div className="flex items-center gap-2"><p className="text-lg font-black text-white">{offer.trader}</p>{offer.verified && <BadgeCheck className="text-cyan-300" size={18}/>}</div><p className="mt-1 flex items-center gap-1 text-sm text-white/45"><Star size={14} className="text-gold"/> {offer.rating} · {offer.completion}% completion</p></div>
              <StatusPill status={`${offer.side} ${offer.asset}`}/>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-white/[0.03] p-4"><p className="text-xs text-white/35">Price</p><p className="text-xl font-black text-gold">{offer.price} EGP</p></div>
              <div className="rounded-2xl bg-white/[0.03] p-4"><p className="text-xs text-white/35">Available</p><p className="text-xl font-black text-white">{offer.available.toLocaleString()} {offer.asset}</p></div>
              <div className="rounded-2xl bg-white/[0.03] p-4"><p className="text-xs text-white/35">Limits</p><p className="text-sm font-black text-white">{offer.min} - {offer.max}</p></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">{offer.methods.map(method => <span key={method} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/55">{method}</span>)}</div>
            <div className="mt-5"><PrimaryButton>Open Offer</PrimaryButton></div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
