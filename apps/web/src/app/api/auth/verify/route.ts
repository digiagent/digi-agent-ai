import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const privyId = req.nextUrl.searchParams.get('privyId')

  if (!privyId) {
    return NextResponse.json({
      user: null,
      wallet: null,
      digiHandle: null,
    })
  }

  const user = await db.user.findUnique({
    where: { privyId },
    include: { wallet: true },
  })

  if (!user) {
    return NextResponse.json({
      user: null,
      wallet: null,
      digiHandle: null,
    })
  }

  return NextResponse.json({
    user,
    wallet: user.wallet,
    digiHandle: user.digiHandle,
  })
}
