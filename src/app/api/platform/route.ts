import { NextResponse } from 'next/server'
import {
  alerts,
  approvals,
  financialAccounts,
  merchantPortfolio,
  operations,
  paymentMethods,
  platformMetrics,
  p2pOffers,
  p2pHistory,
  systemHealth,
  volumeChart,
} from '@/lib/psp-platform-data'

export async function GET() {
  return NextResponse.json({
    ok: true,
    platform: 'OnTarget PSP Platform',
    region: 'Egypt & MENA',
    generated_at: new Date().toISOString(),
    metrics: platformMetrics,
    health: systemHealth,
    volume_chart: volumeChart,
    counts: {
      operations: operations.length,
      approvals: approvals.length,
      merchants: merchantPortfolio.length,
      payment_methods: paymentMethods.length,
      accounts: financialAccounts.length,
      p2p_offers: p2pOffers.length,
      p2p_transactions: p2pHistory.length,
      alerts: alerts.length,
    },
  })
}
