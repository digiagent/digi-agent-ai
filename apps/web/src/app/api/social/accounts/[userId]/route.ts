import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const accounts = await db.socialAccount.findMany({ where: { userId } })

  return NextResponse.json({
    accounts: accounts.map((a) => ({
      platform: a.platform,
      connected: a.connected,
      followers: a.followers,
      handle: a.handle,
    })),
  })
}
