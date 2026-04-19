const STORAGE_KEY = 'ironman-tracker'

export interface Profile {
  name: string
  startDate: string
}

export interface CompletedWorkout {
  workoutId: string
  completedAt: string
  notes?: string
}

export type SwapMap = Record<number, [string, string][]>

export interface UserData {
  profiles: Profile[]
  activeProfile: string | null
  completed: Record<string, CompletedWorkout[]>
  swaps: Record<string, SwapMap>
}

function defaultData(): UserData {
  return { profiles: [], activeProfile: null, completed: {}, swaps: {} }
}

export function load(): UserData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData()
    const d = JSON.parse(raw)
    if (!d.swaps) d.swaps = {}
    return d
  } catch {
    return defaultData()
  }
}

export function save(data: UserData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getCompletedIds(data: UserData, profile: string): Set<string> {
  return new Set((data.completed[profile] || []).map(c => c.workoutId))
}

export function toggleWorkout(data: UserData, profile: string, workoutId: string): UserData {
  const list = data.completed[profile] || []
  const exists = list.find(c => c.workoutId === workoutId)
  const newList = exists
    ? list.filter(c => c.workoutId !== workoutId)
    : [...list, { workoutId, completedAt: new Date().toISOString() }]
  return { ...data, completed: { ...data.completed, [profile]: newList } }
}

export function addProfile(data: UserData, name: string, startDate: string): UserData {
  if (data.profiles.find(p => p.name === name)) return data
  return {
    ...data,
    profiles: [...data.profiles, { name, startDate }],
    activeProfile: data.activeProfile || name,
  }
}

export function setActiveProfile(data: UserData, name: string): UserData {
  return { ...data, activeProfile: name }
}

export function deleteProfile(data: UserData, name: string): UserData {
  const profiles = data.profiles.filter(p => p.name !== name)
  const completed = { ...data.completed }
  const swaps = { ...data.swaps }
  delete completed[name]
  delete swaps[name]
  return {
    ...data,
    profiles,
    completed,
    swaps,
    activeProfile: data.activeProfile === name ? (profiles[0]?.name || null) : data.activeProfile,
  }
}

export function swapWorkouts(data: UserData, profile: string, weekNum: number, idA: string, idB: string): UserData {
  const profileSwaps = { ...(data.swaps[profile] || {}) }
  const weekSwaps = [...(profileSwaps[weekNum] || [])]
  weekSwaps.push([idA, idB])
  profileSwaps[weekNum] = weekSwaps
  return { ...data, swaps: { ...data.swaps, [profile]: profileSwaps } }
}

export function getSwappedDay(data: UserData, profile: string, weekNum: number, workoutId: string, originalDay: string): string {
  const weekSwaps = data.swaps[profile]?.[weekNum] || []
  let day = originalDay
  const dayMap = new Map<string, string>()

  for (const [idA, idB] of weekSwaps) {
    const dayA = dayMap.get(idA)
    const dayB = dayMap.get(idB)
    if (dayA !== undefined || dayB !== undefined) {
      const resolvedA = dayA ?? idA
      const resolvedB = dayB ?? idB
      dayMap.set(idA, resolvedB)
      dayMap.set(idB, resolvedA)
    } else {
      dayMap.set(idA, idB)
      dayMap.set(idB, idA)
    }
  }

  if (dayMap.has(workoutId)) {
    const partnerId = dayMap.get(workoutId)!
    return partnerId
  }
  return day
}

export interface ResolvedWorkout {
  id: string
  day: string
  sport: string
  type: string
  title: string
  description: string
  hasTransitionRun?: boolean
  transitionDesc?: string
}

export function resolveWeekWorkouts(
  data: UserData,
  profile: string,
  weekNum: number,
  workouts: { id: string; day: string; sport: string; type: string; title: string; description: string; hasTransitionRun?: boolean; transitionDesc?: string }[]
): ResolvedWorkout[] {
  const weekSwaps = data.swaps[profile]?.[weekNum] || []
  if (weekSwaps.length === 0) return workouts

  const idToWorkout = new Map(workouts.map(w => [w.id, w]))
  const dayOverrides = new Map<string, string>()

  for (const [idA, idB] of weekSwaps) {
    const wA = idToWorkout.get(idA)
    const wB = idToWorkout.get(idB)
    if (!wA || !wB) continue
    const currentDayA = dayOverrides.get(idA) ?? wA.day
    const currentDayB = dayOverrides.get(idB) ?? wB.day
    dayOverrides.set(idA, currentDayB)
    dayOverrides.set(idB, currentDayA)
  }

  return workouts.map(w => ({
    ...w,
    day: dayOverrides.get(w.id) ?? w.day,
  }))
}
