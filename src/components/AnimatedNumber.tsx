import { useEffect, useRef } from 'react'
import { useSpring, useTransform, motion, useMotionValue } from 'motion/react'

interface AnimatedNumberProps {
  value: number
  className?: string
  suffix?: string
}

export function AnimatedNumber({ value, className = '', suffix = '' }: AnimatedNumberProps) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { stiffness: 80, damping: 20 })
  const display = useTransform(springValue, (v: number) => Math.round(v))
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  useEffect(() => {
    const unsubscribe = display.on('change', (v: number) => {
      if (ref.current) ref.current.textContent = `${v}${suffix}`
    })
    return unsubscribe
  }, [display, suffix])

  return <span ref={ref} className={className}>{value}{suffix}</span>
}

interface AnimatedPercentProps {
  value: number
  className?: string
}

export function AnimatedPercent({ value, className = '' }: AnimatedPercentProps) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { stiffness: 60, damping: 18 })
  const display = useTransform(springValue, (v: number) => Math.round(v))
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  useEffect(() => {
    const unsubscribe = display.on('change', (v: number) => {
      if (ref.current) ref.current.textContent = `${v}%`
    })
    return unsubscribe
  }, [display])

  return <span ref={ref} className={className}>{value}%</span>
}

export function AnimatedProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-full ${className}`}>
      <motion.div
        className="h-full bg-cyan-500 rounded-full shimmer-bar"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: 'spring', stiffness: 60, damping: 18 }}
      />
    </div>
  )
}
