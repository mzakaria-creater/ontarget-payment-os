import { NextRequest, NextResponse } from 'next/server'
import { approvals } from '@/lib/psp-platform-data'

export async function GET() {
  return NextResponse.json({ ok: true, count: approvals.length, data: approvals })
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { approval_id, action, note } = body

  if (!approval_id || !['approve', 'reject', 'escalate'].includes(action)) {
    return NextResponse.json({ ok: false, error: 'Send approval_id and action: approve, reject, or escalate' }, { status: 400 })
  }

  return NextResponse.json({
    ok: true,
    approval_id,
    action,
    note: note || null,
    audit_log: {
      actor: 'operations-admin',
      at: new Date().toISOString(),
      result: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'escalated',
    },
  })
}
