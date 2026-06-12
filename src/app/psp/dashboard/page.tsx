'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeading, GlassCard, MetricTile, SeverityBadge, StatusPill, icons } from '@/components/psp/PlatformShell'
import { alerts, liveActivities, platformMetrics, systemHealth, volumeChart } from '@/lib/psp-platform-data'

export default function EnterpriseDashboardPage() {
  return (
    <div>
      <PageHeading
        eyebrow="Enterprise Command Center"
        title="Real-time PSP Dashboard"
        description="Live payment operations, gateway health, approval pressure, wallet capacity, risk alerts, and MENA transaction flow in one command view."
        action={<div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">● Live sync</div>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {platformMetrics.map((metric, index) => (
          <MetricTile key={metric.label} {...metric} icon={index === 0 ? <icons.BarChart3 size={18} /> : index === 1 ? <icons.CheckCircle2 size={18} /> : index === 2 ? <icons.Clock size={18} /> : <icons.Zap size={18} />} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <GlassCard>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">Volume Flow</h2>
              <p className="text-sm text-white/40">Deposits, payouts, and approvals through the day</p>
            </div>
            <StatusPill status="Realtime" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeChart}>
                <defs>
                  <linearGradient id="deposits" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D4AF37" stopOpacity={0.35}/><stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/></linearGradient>
                  <linearGradient id="payouts" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35}/><stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.35)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.35)" fontSize={12} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, color: '#fff' }} />
                <Area type="monotone" dataKey="deposits" stroke="#D4AF37" fill="url(#deposits)" strokeWidth={2} />
                <Area type="monotone" dataKey="payouts" stroke="#7C3AED" fill="url(#payouts)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-black text-white">System Health</h2>
          <p className="mb-5 text-sm text-white/40">API, realtime, SMS, and webhook services</p>
          <div className="space-y-3">
            {systemHealth.map(service => (
              <div key={service.service} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{service.service}</p>
                  <StatusPill status={service.status} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/40">
                  <span>Latency: <b className="text-white/70">{service.latency}</b></span>
                  <span>Uptime: <b className="text-white/70">{service.uptime}</b></span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <GlassCard>
          <h2 className="mb-4 text-lg font-black text-white">Live Activity Feed</h2>
          <div className="space-y-3">
            {liveActivities.map((activity, index) => (
              <div key={activity} className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-gold" />
                <div><p className="text-sm text-white/80">{activity}</p><p className="text-xs text-white/30">{index + 2} min ago</p></div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 text-lg font-black text-white">Alert Management</h2>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-semibold text-white">{alert.title}</p><p className="mt-1 text-sm text-white/45">{alert.description}</p></div>
                  <SeverityBadge severity={alert.severity} />
                </div>
                <p className="mt-3 text-xs text-white/30">{alert.source} · {alert.createdAt}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
