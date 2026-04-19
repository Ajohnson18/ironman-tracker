import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'motion/react'
import type { Sport } from '../data/plan'

export function ProgressRing3D({ sportStats }: { sportStats: Record<Sport, { done: number; total: number }> }) {
  const totalAll = Object.values(sportStats).reduce((s, v) => s + v.total, 0)
  const doneAll = Object.values(sportStats).reduce((s, v) => s + v.done, 0)
  const pct = totalAll > 0 ? doneAll / totalAll : 0

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const springPct = useSpring(0, { stiffness: 40, damping: 18 })
  useEffect(() => { if (mounted) springPct.set(pct) }, [pct, mounted, springPct])

  const fillY = useTransform(springPct, [0, 1], [200, 0])

  const goldLight = '#fbbf24'
  const goldMid = '#f59e0b'
  const goldDark = '#d97706'

  return (
    <div className="flex justify-center py-2">
      <div className="relative w-48 h-56">
        <svg
          viewBox="0 0 200 240"
          className="w-full h-full drop-shadow-[0_0_24px_rgba(245,158,11,0.15)]"
        >
          <defs>
            {/* Gold gradient for fill */}
            <linearGradient id="goldFill" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={goldDark} />
              <stop offset="40%" stopColor={goldMid} />
              <stop offset="100%" stopColor={goldLight} />
            </linearGradient>

            {/* Animated clip rect that rises from bottom */}
            <clipPath id="fillClip">
              <motion.rect
                x="0"
                width="200"
                height="240"
                style={{ y: fillY }}
              />
            </clipPath>

            {/* Glow filter */}
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0.8 0.6 0 0 0  0 0 0 0 0  0 0 0 0.6 0" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Shimmer moving highlight */}
            <linearGradient id="shimmer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="55%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="0 0.6"
                to="0 -0.6"
                dur="3s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>

          {/* ── MDOT Logo Shape ── */}
          {/* Outer circle */}
          <circle cx="100" cy="128" r="88" fill="none" stroke="#1e293b" strokeWidth="10" opacity="0.5" />
          {/* Dot at top */}
          <circle cx="100" cy="28" r="14" fill="#1e293b" opacity="0.5" />
          {/* Vertical bar connecting dot to circle */}
          <rect x="94" y="42" width="12" height="48" rx="6" fill="#1e293b" opacity="0.5" />

          {/* ── Gold filled version (clipped by animated rect) ── */}
          <g clipPath="url(#fillClip)" filter="url(#goldGlow)">
            {/* Outer circle - gold */}
            <circle cx="100" cy="128" r="88" fill="none" stroke="url(#goldFill)" strokeWidth="10" />
            {/* Dot at top - gold */}
            <circle cx="100" cy="28" r="14" fill="url(#goldFill)" />
            {/* Vertical bar - gold */}
            <rect x="94" y="42" width="12" height="48" rx="6" fill="url(#goldFill)" />

            {/* Shimmer overlay */}
            <circle cx="100" cy="128" r="88" fill="none" stroke="url(#shimmer)" strokeWidth="10" />
            <circle cx="100" cy="28" r="14" fill="url(#shimmer)" />
            <rect x="94" y="42" width="12" height="48" rx="6" fill="url(#shimmer)" />
          </g>

          {/* Sport breakdown ticks at bottom of circle */}
          {(() => {
            const sports: Sport[] = ['swim', 'bike', 'run']
            const colors: Record<Sport, string> = { swim: '#06b6d4', bike: '#f59e0b', run: '#10b981' }
            const totalDone = doneAll
            if (totalDone === 0) return null
            const cx = 100, cy = 128, r = 100
            let startAngle = Math.PI * 0.5

            return sports.map(sport => {
              const sportDone = sportStats[sport].done
              if (sportDone === 0) { startAngle += (sportDone / Math.max(1, totalDone)) * Math.PI * 2; return null }
              const frac = sportDone / totalDone
              const sweep = frac * Math.PI * 2
              const endAngle = startAngle + sweep
              const x1 = cx + r * Math.cos(startAngle)
              const y1 = cy + r * Math.sin(startAngle)
              const x2 = cx + r * Math.cos(endAngle)
              const y2 = cy + r * Math.sin(endAngle)
              const largeArc = sweep > Math.PI ? 1 : 0
              const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
              startAngle = endAngle
              return (
                <motion.path
                  key={sport}
                  d={d}
                  fill="none"
                  stroke={colors[sport]}
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.7 }}
                  transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                />
              )
            })
          })()}
        </svg>
      </div>
    </div>
  )
}
