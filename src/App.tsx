import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react'
import { plan, type Week, type Sport } from './data/plan'
import * as store from './store'
import type { UserData } from './store'
import { SportIcon, ClipboardIcon, ChartIcon, UserIcon, CheckIcon, MoveIcon, ResetIcon, XIcon, SwimIcon, BikeIcon, RunIcon } from './icons'
import { AnimatedNumber, AnimatedPercent, AnimatedProgressBar } from './components/AnimatedNumber'
import { ConfettiCanvas, useConfetti } from './components/Confetti'
import { ProgressRing3D } from './components/ProgressRing3D'
import { Auth } from './components/Auth'
import { supabase } from './lib/supabase'
import type { Session } from '@supabase/supabase-js'

const SPORT_COLOR: Record<Sport, string> = {
  swim: 'text-cyan-400',
  bike: 'text-amber-400',
  run: 'text-emerald-400',
}
const SPORT_BADGE: Record<Sport, string> = {
  swim: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  bike: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  run: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
}
const TYPE_LABEL: Record<string, string> = {
  interval: 'INT',
  easy: 'EASY',
  endurance: 'END',
  tempo: 'TEMPO',
  time_trial: 'TT',
}
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, type: 'spring' as const, stiffness: 300, damping: 25 } }),
}

const tabTransition = { type: 'spring' as const, stiffness: 300, damping: 30 }

function useStore(session: Session | null) {
  const [data, setData] = useState<UserData>(store.load)
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    if (!session) return
    store.loadRemote().then(remote => {
      setData(remote)
      setSynced(true)
    })
  }, [session])

  const update = useCallback((fn: (d: UserData) => UserData) => {
    setData(prev => {
      const next = fn(prev)
      store.save(next)
      return next
    })
  }, [])
  return [data, update, synced] as const
}

// ─── Splash / Profile Setup ────────────────────────

function ProfileSetup({ onDone }: { onDone: (name: string, date: string) => void }) {
  const [name, setName] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const title = 'IRONMAN TRACKER'
  const icons = [SwimIcon, BikeIcon, RunIcon]
  const iconColors = ['text-cyan-400', 'text-amber-400', 'text-emerald-400']

  return (
    <div className="min-h-svh bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="bg-mesh" />
      <motion.div
        className="w-full max-w-sm space-y-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white tracking-tight flex justify-center flex-wrap">
            {title.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 20 }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>
          <div className="flex justify-center gap-4">
            {icons.map((Icon, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.6 + i * 0.15, type: 'spring', stiffness: 200, damping: 15 }}
              >
                <Icon className={`w-8 h-8 ${iconColors[i]}`} />
              </motion.div>
            ))}
          </div>
          <motion.p
            className="text-slate-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            20-week training plan
          </motion.p>
        </div>
        <motion.div
          className="glass-card rounded-2xl p-6 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Training Start Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>
          <motion.button
            onClick={() => name.trim() && onDone(name.trim(), date)}
            disabled={!name.trim()}
            className="w-full bg-cyan-600 active:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors touch-manipulation"
            whileTap={{ scale: 0.97 }}
          >
            Start Training
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─── Week Selector ────────────────────────

function WeekSelector({ current, setCurrent, completedIds }: { current: number; setCurrent: (n: number) => void; completedIds: Set<string> }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = scrollRef.current?.querySelector(`[data-week="${current}"]`) as HTMLElement | null
    el?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' })
  }, [current])

  return (
    <div ref={scrollRef} className="flex gap-1 overflow-x-auto pb-2 px-3 scrollbar-none">
      {plan.map(week => {
        const done = week.workouts.filter(w => completedIds.has(w.id)).length
        const total = week.workouts.length
        const pct = total > 0 ? done / total : 0
        const active = week.number === current
        return (
          <button
            key={week.number}
            data-week={week.number}
            onClick={() => setCurrent(week.number)}
            className="flex-shrink-0 flex flex-col items-center gap-0.5 min-w-[2.5rem] py-2 rounded-xl text-xs relative touch-manipulation"
          >
            {active && (
              <motion.div
                layoutId="activeWeek"
                className="absolute inset-0 bg-cyan-600 rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`font-bold relative z-10 text-[13px] ${active ? 'text-white' : 'text-slate-400'}`}>{week.number}</span>
            <span className="relative z-10">
              {pct === 1 ? (
                <CheckIcon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-cyan-400'}`} />
              ) : pct > 0 ? (
                <div className="w-5 h-1 bg-slate-600 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${pct * 100}%` }} />
                </div>
              ) : (
                <span className="w-5 h-1 block" />
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Workout Card ────────────────────────

interface WorkoutCardProps {
  workout: store.ResolvedWorkout
  done: boolean
  moveMode: boolean
  moveSelected: boolean
  index: number
  onToggle: () => void
  onMoveSelect: () => void
}

function WorkoutCard({ workout, done, moveMode, moveSelected, index, onToggle, onMoveSelect }: WorkoutCardProps) {
  const sport = workout.sport as Sport
  const [showRipple, setShowRipple] = useState(false)

  const handleClick = () => {
    if (moveMode) {
      onMoveSelect()
    } else {
      if (!done) setShowRipple(true)
      onToggle()
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileTap={{ scale: 0.97 }}
      className={`w-full text-left p-3.5 rounded-xl transition-colors relative overflow-hidden touch-manipulation ${
        moveSelected
          ? 'glass-card swap-pulse border border-violet-500/50'
          : done
            ? 'glass-card opacity-50'
            : 'glass-card glass-card-active'
      }`}
    >
      {showRipple && (
        <span
          className="ripple-effect w-4 h-4 left-4 top-1/2 -translate-y-1/2"
          onAnimationEnd={() => setShowRipple(false)}
        />
      )}
      <div className="flex items-start gap-3 relative z-10">
        {moveMode ? (
          <motion.div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
              moveSelected ? 'bg-violet-600 border-violet-600' : 'border-slate-600'
            }`}
            animate={moveSelected ? { scale: [1, 1.15, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {moveSelected && <MoveIcon className="w-3 h-3 text-white" />}
          </motion.div>
        ) : (
          <motion.div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
              done ? 'bg-cyan-600 border-cyan-600' : 'border-slate-600'
            }`}
            animate={done ? { scale: [0, 1.2, 1] } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            {done && <CheckIcon className="w-3 h-3 text-white" />}
          </motion.div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <SportIcon sport={sport} className={`w-4 h-4 ${SPORT_COLOR[sport]}`} />
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${SPORT_BADGE[sport]}`}>
              {TYPE_LABEL[workout.type]}
            </span>
            <span className={`font-semibold text-sm ${done && !moveMode ? 'text-slate-500 line-through' : 'text-white'}`}>
              {workout.title}
            </span>
            {workout.moved && !moveMode && (
              <span className="text-[9px] text-violet-400 font-medium">MOVED</span>
            )}
          </div>
          <p className={`text-xs ${done && !moveMode ? 'text-slate-600' : 'text-slate-400'}`}>{workout.description}</p>
          {workout.hasTransitionRun && (
            <p className="text-xs text-orange-400/70 mt-0.5">+ T-Run: {workout.transitionDesc}</p>
          )}
        </div>
      </div>
    </motion.button>
  )
}

// ─── Day Group ────────────────────────

interface DayGroupProps {
  day: string
  workouts: store.ResolvedWorkout[]
  completedIds: Set<string>
  moveMode: boolean
  moveSelectedId: string | null
  indexOffset: number
  onToggle: (id: string) => void
  onMoveSelect: (id: string) => void
}

function DayGroup({ day, workouts, completedIds, moveMode, moveSelectedId, indexOffset, onToggle, onMoveSelect }: DayGroupProps) {
  if (workouts.length === 0) return null
  const allDone = !moveMode && workouts.every(w => completedIds.has(w.id))
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className={`text-xs font-bold uppercase tracking-wider ${allDone ? 'text-cyan-500' : 'text-slate-500'}`}>{day}</span>
        {allDone && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
            <CheckIcon className="w-3 h-3 text-cyan-500" />
          </motion.span>
        )}
      </div>
      <div className="space-y-2">
        {workouts.map((w, i) => (
          <WorkoutCard
            key={w.id}
            workout={w}
            done={completedIds.has(w.id)}
            moveMode={moveMode}
            moveSelected={moveSelectedId === w.id}
            index={indexOffset + i}
            onToggle={() => onToggle(w.id)}
            onMoveSelect={() => onMoveSelect(w.id)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Week View ────────────────────────

interface WeekViewProps {
  week: Week
  resolvedWorkouts: store.ResolvedWorkout[]
  completedIds: Set<string>
  moveMode: boolean
  moveSelectedId: string | null
  hasOverrides: boolean
  direction: number
  onToggle: (id: string) => void
  onMoveSelect: (id: string) => void
  onMoveToDay: (day: string) => void
  onToggleMoveMode: () => void
  onResetWeek: () => void
  onSwipeWeek: (delta: number) => void
}

function WeekView({ week, resolvedWorkouts, completedIds, moveMode, moveSelectedId, hasOverrides, direction, onToggle, onMoveSelect, onMoveToDay, onToggleMoveMode, onResetWeek, onSwipeWeek }: WeekViewProps) {
  const done = resolvedWorkouts.filter(w => completedIds.has(w.id)).length
  const total = resolvedWorkouts.length
  const dragX = useMotionValue(0)
  const dragOpacity = useTransform(dragX, [-150, 0, 150], [0.5, 1, 0.5])

  let cardIndex = 0

  return (
    <motion.div
      key={week.number}
      initial={{ x: direction * 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction * -60, opacity: 0 }}
      transition={tabTransition}
    >
      <motion.div
        className="space-y-4 px-4 pb-6"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        style={{ x: dragX, opacity: dragOpacity }}
        onDragEnd={(_e, info) => {
          if (info.offset.x < -80 && info.velocity.x < -200) onSwipeWeek(1)
          else if (info.offset.x > 80 && info.velocity.x > 200) onSwipeWeek(-1)
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">
              Week {week.number}
            </h2>
            {week.isRecovery && (
              <motion.span
                className="text-xs font-medium text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                Recovery
              </motion.span>
            )}
            <motion.button
              onClick={onToggleMoveMode}
              className={`p-2 rounded-lg transition-colors touch-manipulation ${
                moveMode ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 active:bg-slate-700'
              }`}
              whileTap={{ scale: 0.9 }}
              title={moveMode ? 'Cancel move' : 'Move workouts'}
            >
              {moveMode ? <XIcon className="w-4 h-4" /> : <MoveIcon className="w-4 h-4" />}
            </motion.button>
            {hasOverrides && !moveMode && (
              <motion.button
                onClick={onResetWeek}
                className="p-2 rounded-lg bg-slate-800 text-amber-400 active:bg-slate-700 transition-colors touch-manipulation"
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                title="Reset week to original"
              >
                <ResetIcon className="w-4 h-4" />
              </motion.button>
            )}
          </div>
          <div className="text-right">
            <span className="text-sm font-mono text-cyan-400">
              <AnimatedNumber value={done} />/{total}
            </span>
            <AnimatedProgressBar value={(done / total) * 100} className="w-20 h-1.5 bg-slate-800 mt-1" />
          </div>
        </div>
        <AnimatePresence>
          {moveMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {moveSelectedId ? (
                <div className="space-y-2">
                  <div className="text-xs text-violet-300 px-1">Move to:</div>
                  <div className="flex gap-1.5">
                    {DAYS.map(day => {
                      const selected = resolvedWorkouts.find(w => w.id === moveSelectedId)
                      const isCurrent = selected?.day === day
                      return (
                        <button
                          key={day}
                          onClick={() => !isCurrent && onMoveToDay(day)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors touch-manipulation ${
                            isCurrent
                              ? 'bg-violet-600 text-white'
                              : 'bg-slate-800 text-slate-400 active:bg-violet-600/50 active:text-violet-200'
                          }`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg px-3 py-2 text-xs text-violet-300">
                  Tap a workout to move it to a different day
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-5">
          {DAYS.map(day => {
            const dayWorkouts = resolvedWorkouts.filter(w => w.day === day)
            const offset = cardIndex
            cardIndex += dayWorkouts.length
            return (
              <DayGroup
                key={day}
                day={day}
                workouts={dayWorkouts}
                completedIds={completedIds}
                moveMode={moveMode}
                moveSelectedId={moveSelectedId}
                indexOffset={offset}
                onToggle={onToggle}
                onMoveSelect={onMoveSelect}
              />
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Progress View ────────────────────────

function ProgressView({ completedIds }: { completedIds: Set<string> }) {
  const totalWorkouts = plan.reduce((sum, w) => sum + w.workouts.length, 0)
  const totalDone = completedIds.size
  const pct = Math.round((totalDone / totalWorkouts) * 100)

  const sportStats: Record<Sport, { done: number; total: number }> = { swim: { done: 0, total: 0 }, bike: { done: 0, total: 0 }, run: { done: 0, total: 0 } }
  for (const week of plan) {
    for (const w of week.workouts) {
      sportStats[w.sport].total++
      if (completedIds.has(w.id)) sportStats[w.sport].done++
    }
  }

  return (
    <motion.div
      className="px-4 pb-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={tabTransition}
    >
      <div className="glass-card rounded-2xl p-5 text-center gradient-border">
        <ProgressRing3D sportStats={sportStats} />
        <div className="text-5xl font-bold text-cyan-400 font-mono mt-2">
          <AnimatedPercent value={pct} />
        </div>
        <div className="text-sm text-slate-400 mt-1">
          <AnimatedNumber value={totalDone} /> / {totalWorkouts} workouts
        </div>
        <AnimatedProgressBar value={pct} className="w-full h-2 bg-slate-800 mt-3" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {(Object.entries(sportStats) as [Sport, { done: number; total: number }][]).map(([sport, s], i) => (
          <motion.div
            key={sport}
            className="glass-card rounded-xl p-3 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex justify-center mb-1">
              <SportIcon sport={sport} className={`w-6 h-6 ${SPORT_COLOR[sport]}`} />
            </div>
            <div className="text-lg font-bold text-white font-mono">
              <AnimatedNumber value={s.done} /><span className="text-slate-500 text-sm">/{s.total}</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{sport}</div>
          </motion.div>
        ))}
      </div>
      <div className="space-y-2">
        {plan.map((week, i) => {
          const done = week.workouts.filter(w => completedIds.has(w.id)).length
          const total = week.workouts.length
          const wpct = total > 0 ? (done / total) * 100 : 0
          return (
            <motion.div
              key={week.number}
              className="flex items-center gap-3 glass-card rounded-lg px-3 py-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.02, type: 'spring', stiffness: 300, damping: 25 }}
            >
              <span className="text-xs font-bold text-slate-500 w-6">W{week.number}</span>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${wpct === 100 ? 'bg-cyan-400' : 'bg-cyan-600'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${wpct}%` }}
                  transition={{ delay: 0.3 + i * 0.02, type: 'spring', stiffness: 80, damping: 18 }}
                />
              </div>
              <span className="text-xs font-mono text-slate-500 w-8 text-right">{done}/{total}</span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Profile View ────────────────────────

function ProfileView({ data, profile, update, onSignOut }: { data: UserData; profile: string; update: (fn: (d: UserData) => UserData) => void; onSignOut: () => void }) {
  return (
    <motion.div
      className="px-4 pb-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={tabTransition}
    >
      <h2 className="text-lg font-bold text-white">Profiles</h2>
      {data.profiles.map((p, i) => {
        const pDone = store.getCompletedIds(data, p.name).size
        const pTotal = plan.reduce((s, w) => s + w.workouts.length, 0)
        return (
          <motion.div
            key={p.name}
            className="glass-card rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{p.name}</span>
                {p.name === profile && <span className="text-[10px] text-cyan-400 font-bold">ACTIVE</span>}
              </div>
              <div className="flex gap-3">
                {p.name !== profile && (
                  <button onClick={() => { update(d => store.setActiveProfile(d, p.name)); store.syncSetActiveProfile(p.name) }} className="text-sm px-3 py-1.5 text-cyan-400 active:text-cyan-300 touch-manipulation">Switch</button>
                )}
                <button onClick={() => { if (confirm(`Delete ${p.name}?`)) { update(d => store.deleteProfile(d, p.name)); store.syncDeleteProfile(p.name) } }} className="text-sm px-3 py-1.5 text-red-400 active:text-red-300 touch-manipulation">Delete</button>
              </div>
            </div>
            <div className="text-xs text-slate-500">Started: {p.startDate}</div>
            <div className="text-xs text-slate-500">Progress: {pDone}/{pTotal} workouts</div>
          </motion.div>
        )
      })}
      <motion.button
        onClick={onSignOut}
        className="w-full py-3 rounded-xl bg-slate-800 text-slate-400 font-medium active:bg-slate-700 transition-colors touch-manipulation mt-4"
        whileTap={{ scale: 0.97 }}
      >
        Sign Out
      </motion.button>
    </motion.div>
  )
}

// ─── Add Profile Modal ────────────────────────

function AddProfileModal({ onDone, onClose }: { onDone: (name: string, date: string) => void; onClose: () => void }) {
  const [name, setName] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        className="glass-card rounded-2xl p-6 w-full max-w-sm space-y-4 relative z-10 border border-slate-700/50"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-white">Add Profile</h2>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Sarah"
            autoFocus
            className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Start Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
          />
        </div>
        <div className="flex gap-3">
          <motion.button whileTap={{ scale: 0.97 }} onClick={onClose} className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-medium active:bg-slate-700 transition-colors touch-manipulation">Cancel</motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => name.trim() && onDone(name.trim(), date)}
            disabled={!name.trim()}
            className="flex-1 py-3 rounded-xl bg-cyan-600 text-white font-semibold active:bg-cyan-500 disabled:opacity-40 transition-colors touch-manipulation"
          >Add</motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main App ────────────────────────

type Tab = 'plan' | 'progress' | 'profile'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setAuthChecked(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!authChecked) {
    return (
      <div className="min-h-svh bg-slate-950 flex items-center justify-center">
        <div className="bg-mesh" />
        <div className="text-slate-500 text-sm">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return <Auth onAuth={() => {}} />
  }

  return <AppInner session={session} />
}

function AppInner({ session }: { session: Session }) {
  const [data, update, synced] = useStore(session)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [tab, setTab] = useState<Tab>('plan')
  const [showAddProfile, setShowAddProfile] = useState(false)
  const [moveMode, setMoveMode] = useState(false)
  const [moveSelectedId, setMoveSelectedId] = useState<string | null>(null)
  const [weekDirection, setWeekDirection] = useState(0)
  const prevCompletedRef = useRef<number>(0)
  const { ref: confettiRef, fire: fireConfetti } = useConfetti()

  const profile = data.activeProfile
  const completedIds = profile ? store.getCompletedIds(data, profile) : new Set<string>()

  useEffect(() => {
    if (!profile) return
    const currentCount = completedIds.size
    const prevCount = prevCompletedRef.current
    if (currentCount > prevCount && prevCount > 0) {
      const week = plan.find(w => w.number === currentWeek)
      if (week) {
        const weekDone = week.workouts.every(w => completedIds.has(w.id))
        if (weekDone) {
          fireConfetti('medium')
        } else {
          for (const day of DAYS) {
            const dayWorkouts = week.workouts.filter(w => w.day === day)
            if (dayWorkouts.length > 0 && dayWorkouts.every(w => completedIds.has(w.id))) {
              const prevDayDone = dayWorkouts.every(w => {
                const prevIds = new Set(
                  (data.completed[profile] || [])
                    .filter(c => c.workoutId !== dayWorkouts[dayWorkouts.length - 1].id)
                    .map(c => c.workoutId)
                )
                return prevIds.has(w.id)
              })
              if (!prevDayDone) {
                fireConfetti('small')
                break
              }
            }
          }
        }
      }
      const totalWorkouts = plan.reduce((sum, w) => sum + w.workouts.length, 0)
      const milestones = [0.25, 0.5, 0.75, 1.0]
      for (const m of milestones) {
        const threshold = Math.floor(totalWorkouts * m)
        if (currentCount >= threshold && prevCount < threshold) {
          fireConfetti('large')
          break
        }
      }
    }
    prevCompletedRef.current = currentCount
  }, [completedIds.size])

  async function handleSignOut() {
    await supabase.auth.signOut()
    store.save(store.defaultData())
  }

  if (!synced) {
    return (
      <div className="min-h-svh bg-slate-950 flex items-center justify-center">
        <div className="bg-mesh" />
        <div className="text-slate-500 text-sm">Syncing...</div>
      </div>
    )
  }

  if (!profile || data.profiles.length === 0) {
    return (
      <>
        <div className="bg-mesh" />
        <ProfileSetup onDone={(name, date) => {
          update(d => store.addProfile(d, name, date))
          store.syncAddProfile(name, date, true)
        }} />
      </>
    )
  }

  const week = plan.find(w => w.number === currentWeek) || plan[0]
  const resolvedWorkouts = store.resolveWeekWorkouts(data, profile, currentWeek, week.workouts)
  const hasOverrides = store.hasWeekOverrides(data, profile, currentWeek)

  function handleToggle(id: string) {
    const isCompleting = !completedIds.has(id)
    update(d => store.toggleWorkout(d, profile!, id))
    store.syncToggleWorkout(profile!, id, isCompleting)
  }

  function handleMoveSelect(id: string) {
    setMoveSelectedId(prev => prev === id ? null : id)
  }

  function handleMoveToDay(day: string) {
    if (!moveSelectedId) return
    update(d => store.moveWorkout(d, profile!, currentWeek, moveSelectedId, day))
    store.syncMoveWorkout(profile!, currentWeek, moveSelectedId, day)
    setMoveSelectedId(null)
  }

  function handleResetWeek() {
    update(d => store.resetWeek(d, profile!, currentWeek))
    store.syncResetWeek(profile!, currentWeek)
  }

  function changeWeek(n: number) {
    setWeekDirection(n > currentWeek ? 1 : -1)
    setCurrentWeek(n)
    setMoveMode(false)
    setMoveSelectedId(null)
  }

  function swipeWeek(delta: number) {
    const next = Math.max(1, Math.min(20, currentWeek + delta))
    if (next !== currentWeek) changeWeek(next)
  }

  const tabItems: [Tab, typeof ClipboardIcon, string][] = [
    ['plan', ClipboardIcon, 'Plan'],
    ['progress', ChartIcon, 'Progress'],
    ['profile', UserIcon, 'Profile'],
  ]

  return (
    <div className="h-full bg-slate-950 flex flex-col max-w-lg mx-auto relative md:max-w-2xl">
      <div className="bg-mesh" />
      <ConfettiCanvas confettiRef={confettiRef} />

      <header className="shrink-0 z-20 glass" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <motion.h1
            className="text-base font-bold text-white tracking-tight"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            IRONMAN
          </motion.h1>
          <div className="flex items-center gap-2">
            {data.profiles.map(p => (
              <motion.button
                key={p.name}
                onClick={() => { update(d => store.setActiveProfile(d, p.name)); store.syncSetActiveProfile(p.name) }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors touch-manipulation ${
                  p.name === profile ? 'bg-cyan-600 text-white' : 'bg-slate-800/80 text-slate-400 active:bg-slate-700'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {p.name}
              </motion.button>
            ))}
            <motion.button
              onClick={() => setShowAddProfile(true)}
              className="w-8 h-8 rounded-full bg-slate-800/80 text-slate-400 active:bg-slate-700 flex items-center justify-center text-sm touch-manipulation"
              whileTap={{ scale: 0.9 }}
            >+</motion.button>
          </div>
        </div>
        {tab === 'plan' && (
          <WeekSelector current={currentWeek} setCurrent={changeWeek} completedIds={completedIds} />
        )}
      </header>

      <main className="flex-1 pt-4 overflow-y-auto relative z-10 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <AnimatePresence mode="wait">
          {tab === 'plan' && (
            <WeekView
              key={`week-${currentWeek}`}
              week={week}
              resolvedWorkouts={resolvedWorkouts}
              completedIds={completedIds}
              moveMode={moveMode}
              moveSelectedId={moveSelectedId}
              hasOverrides={hasOverrides}
              direction={weekDirection}
              onToggle={handleToggle}
              onMoveSelect={handleMoveSelect}
              onMoveToDay={handleMoveToDay}
              onToggleMoveMode={() => { setMoveMode(!moveMode); setMoveSelectedId(null) }}
              onResetWeek={handleResetWeek}
              onSwipeWeek={swipeWeek}
            />
          )}
          {tab === 'progress' && (
            <ProgressView key="progress" completedIds={completedIds} />
          )}
          {tab === 'profile' && (
            <ProfileView key="profile" data={data} profile={profile} update={update} onSignOut={handleSignOut} />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showAddProfile && (
          <AddProfileModal
            onDone={(name, date) => {
              update(d => store.addProfile(d, name, date))
              store.syncAddProfile(name, date, data.profiles.length === 0)
              setShowAddProfile(false)
            }}
            onClose={() => setShowAddProfile(false)}
          />
        )}
      </AnimatePresence>

      <nav className="shrink-0 z-20 glass flex border-t border-slate-800/50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {tabItems.map(([t, Icon, label]) => (
          <motion.button
            key={t}
            onClick={() => { setTab(t); setMoveMode(false); setMoveSelectedId(null) }}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 relative transition-colors touch-manipulation ${
              tab === t ? 'text-cyan-400' : 'text-slate-500 active:text-slate-400'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {tab === t && (
              <motion.div
                layoutId="activeTab"
                className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-cyan-400 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
          </motion.button>
        ))}
      </nav>
    </div>
  )
}
