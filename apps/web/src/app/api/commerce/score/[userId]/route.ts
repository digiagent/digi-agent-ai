import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const score = await db.commerceScore.findUnique({ where: { userId } })

  if (!score) {
    return NextResponse.json({
      commerceScore: {
        score: 0,
        audienceReach: 0,
        engagementRate: 0,
        postingFrequency: 0,
        nicheAlignment: 0,
        locationSignal: 0,
        niches: [],
      },
    })
  }

  return NextResponse.json({
    commerceScore: {
      score: score.score,
      audienceReach: score.audienceReach,
      engagementRate: score.engagementRate,
      postingFrequency: score.postingFrequency,
      nicheAlignment: score.nicheAlignment,
      locationSignal: score.locationSignal,
      niches: score.niches,
    },
  })
}
