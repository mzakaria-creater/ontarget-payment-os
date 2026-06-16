import { NextResponse } from 'next/server'
import { kycSteps, p2pHistory, p2pOffers, p2pSummary } from '@/lib/psp-platform-data'

export async function GET() {
  return NextResponse.json({
    ok: true,
    summary: p2pSummary,
    offers: p2pOffers,
    history: p2pHistory,
    kyc_steps: kycSteps,
  })
}
