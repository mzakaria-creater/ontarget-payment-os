import { NextRequest, NextResponse } from 'next/server'

function normalizeWebhookPayload(body: Record<string, unknown>) {
  const raw = String(body.raw_sms || body.message || body.content || body.body || '')
  const amountMatch = raw.match(/(?:بمبلغ|amount|Amount)\s*:?\s*([\d,.]+)/i)
  const referenceMatch = raw.match(/(?:رقم العملية|رقم المعاملة|reference|trx|transaction)\s*:?\s*([A-Za-z0-9-]+)/i)

  return {
    provider: body.provider || body.sender || 'unknown',
    webhook_name: body.webhook_name || body.webhookName || 'n8n',
    webhook_address: body.webhook_address || body.webhookUrl || null,
    raw_message: raw,
    amount: body.amount || (amountMatch ? Number(amountMatch[1].replace(/,/g, '')) : null),
    reference: body.reference || body.trx_id || (referenceMatch ? referenceMatch[1] : null),
    sender_number: body.sender_number || body.from || null,
    receiver_number: body.receiver_number || body.to || null,
    received_at: body.received_at || new Date().toISOString(),
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as Record<string, unknown>
  const normalized = normalizeWebhookPayload(body)

  return NextResponse.json({
    ok: true,
    message: 'Webhook received and normalized',
    normalized,
    next_actions: ['parse', 'deduplicate', 'match_transaction', 'update_wallet_ledger', 'notify_telegram'],
  }, { status: 202 })
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: '/api/webhooks/n8n',
    method: 'POST',
    accepts: ['sms', 'email', 'webhook_events', 'n8n payloads'],
    required: 'JSON body',
  })
}
