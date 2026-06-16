import { NextRequest, NextResponse } from 'next/server'
import { operations } from '@/lib/psp-platform-data'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const merchant = searchParams.get('merchant')
  const rows = operations.filter(row => {
    const statusMatch = !status || row.status.toLowerCase().includes(status.toLowerCase())
    const merchantMatch = !merchant || row.merchant.toLowerCase().includes(merchant.toLowerCase())
    return statusMatch && merchantMatch
  })

  return NextResponse.json({ ok: true, count: rows.length, data: rows })
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const required = ['type', 'merchant', 'amount', 'method']
  const missing = required.filter(field => body[field] === undefined || body[field] === null || body[field] === '')

  if (missing.length) {
    return NextResponse.json({ ok: false, error: 'Missing required fields', missing }, { status: 400 })
  }

  return NextResponse.json({
    ok: true,
    message: 'Transaction accepted for processing',
    transaction: {
      id: `OPS-${Date.now()}`,
      status: 'Pending Approval',
      risk: Number(body.amount) > 100000 ? 75 : 28,
      source: 'API',
      ...body,
      received_at: new Date().toISOString(),
    },
  }, { status: 201 })
}
