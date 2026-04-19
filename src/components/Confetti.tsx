import { useCallback, useRef, useEffect } from 'react'
import ReactCanvasConfetti from 'react-canvas-confetti'
import type { TCanvasConfettiInstance } from 'react-canvas-confetti/dist/types'

const SPORT_COLORS = ['#06b6d4', '#f59e0b', '#10b981']

interface ConfettiRef {
  fire: (intensity: 'small' | 'medium' | 'large') => void
}

export function useConfetti() {
  const ref = useRef<ConfettiRef | null>(null)
  const fire = useCallback((intensity: 'small' | 'medium' | 'large' = 'small') => {
    ref.current?.fire(intensity)
  }, [])
  return { ref, fire }
}

export function ConfettiCanvas({ confettiRef }: { confettiRef: React.MutableRefObject<ConfettiRef | null> }) {
  const animationInstance = useRef<TCanvasConfettiInstance | null>(null)

  const onInit = useCallback(({ confetti }: { confetti: TCanvasConfettiInstance }) => {
    animationInstance.current = confetti
  }, [])

  useEffect(() => {
    confettiRef.current = {
      fire(intensity) {
        const inst = animationInstance.current
        if (!inst) return

        if (intensity === 'small') {
          inst({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.7 },
            colors: SPORT_COLORS,
            startVelocity: 20,
            gravity: 1.2,
            ticks: 80,
          })
        } else if (intensity === 'medium') {
          inst({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: SPORT_COLORS,
            startVelocity: 30,
            gravity: 0.8,
            ticks: 150,
          })
          setTimeout(() => {
            inst({
              particleCount: 40,
              spread: 100,
              origin: { y: 0.5, x: 0.3 },
              colors: SPORT_COLORS,
              startVelocity: 25,
            })
          }, 200)
        } else {
          const count = 100
          const fire = (opts: object) => inst({ ...opts, colors: SPORT_COLORS })
          fire({ particleCount: count, spread: 100, origin: { y: 0.5 }, startVelocity: 40 })
          setTimeout(() => fire({ particleCount: count / 2, spread: 120, origin: { y: 0.4, x: 0.2 }, startVelocity: 35 }), 150)
          setTimeout(() => fire({ particleCount: count / 2, spread: 120, origin: { y: 0.4, x: 0.8 }, startVelocity: 35 }), 300)
          setTimeout(() => fire({ particleCount: count, spread: 160, origin: { y: 0.6 }, startVelocity: 45, gravity: 0.6 }), 500)
        }
      },
    }
  }, [confettiRef])

  return (
    <ReactCanvasConfetti
      onInit={onInit}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    />
  )
}
