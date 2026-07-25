"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface Props {
  score: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
  className?: string
}

export function CommerceScoreRing({
  score,
  size = 180,
  strokeWidth = 10,
  showLabel = true,
  className = "",
}: Props) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const prefersReduced = useReducedMotion()
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    stiffness: 50,
    damping: 20,
  })
  const strokeDashoffset = useTransform(
    springValue,
    [0, 100],
    [circumference, 0],
  )

  useEffect(() => {
    if (prefersReduced) {
      setAnimatedScore(score)
      motionValue.set(score)
      return
    }
    const timer = setTimeout(() => {
      motionValue.set(score)
    }, 300)

    const interval = setInterval(() => {
      setAnimatedScore((prev) => {
        if (prev < score) return Math.min(prev + 1, score)
        clearInterval(interval)
        return prev
      })
    }, 12)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [score, prefersReduced, motionValue])

  const glowIntensity = score >= 80 ? "drop-shadow-[0_0_12px_#9DCC4A66]" : ""

  return (
    <div className={`flex flex-col items-center gap-2 ${className} ${glowIntensity}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1A2E1F"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A7A1E" />
            <stop offset="100%" stopColor="#9DCC4A" />
          </linearGradient>
        </defs>
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-3xl font-bold text-text-primary font-[family-name:var(--font-display)]">
          {animatedScore}
        </span>
        {showLabel && (
          <span className="text-xs text-text-muted font-medium">/ 100</span>
        )}
      </div>
    </div>
  )
}
