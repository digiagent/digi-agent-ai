import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const wallet = await db.wallet.findUnique({ where: { userId } })

  if (!wallet) return NextResponse.json({ activity: [] })

  const transactions = await db.transaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return NextResponse.json({
    activity: transactions.map((tx) => ({
      id: tx.id,
      type: tx.type,
      description: tx.description,
      amount: tx.amount,
      asset: tx.asset,
      status: tx.status,
      createdAt: tx.createdAt.toISOString(),
    })),
  })
}
