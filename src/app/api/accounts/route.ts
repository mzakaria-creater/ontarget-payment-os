import { NextResponse } from 'next/server'
import { financialAccounts } from '@/lib/psp-platform-data'

export async function GET() {
  const totals = financialAccounts.reduce((acc, item) => {
    acc.total += item.total
    acc.available += item.available
    acc.locked += item.locked
    return acc
  }, { total: 0, available: 0, locked: 0 })

  return NextResponse.json({ ok: true, count: financialAccounts.length, totals, data: financialAccounts })
}
