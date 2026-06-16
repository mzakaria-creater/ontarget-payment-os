import { NextResponse } from 'next/server'
import { paymentMethods } from '@/lib/psp-platform-data'

export async function GET() {
  return NextResponse.json({ ok: true, count: paymentMethods.length, data: paymentMethods })
}
