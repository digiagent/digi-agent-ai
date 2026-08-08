import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const wallet = await db.wallet.findUnique({ where: { userId } })

  return NextResponse.json({
    balance: {
      usdcBalance: wallet?.usdcBalance ?? 0,
      eurcBalance: wallet?.eurcBalance ?? 0,
      rewardsBalance: wallet?.rewardsBalance ?? 0,
    },
  })
}
