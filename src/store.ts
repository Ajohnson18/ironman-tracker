import {
  fetchUserData,
  upsertProfile,
  setActiveProfileRemote,
  deleteProfileRemote,
  toggleWorkoutRemote,
  setDayOverrideRemote,
  resetWeekRemote,
} from './lib/supabase'

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

// profile → weekNum → workoutId → newDay
export type DayOverrideMap = Record<number, Record<string, string>>

export interface UserData {
  profiles: Profile[]
  activeProfile: string | null
  completed: Record<string, CompletedWorkout[]>
  dayOverrides: Record<string, DayOverrideMap>
}

export function defaultData(): UserData {
  return { profiles: [], activeProfile: null, completed: {}, dayOverrides: {} }
}

export function load(): UserData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData()
    const d = JSON.parse(raw)
    if (!d.dayOverrides) d.dayOverrides = d.swaps ? {} : {}
    return d
  } catch {
    return defaultData()
  }
}

export function save(data: UserData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export async function loadRemote(): Promise<UserData> {
  try {
    const data = await fetchUserData()
    save(data)
    return data
  } catch {
    return load()
  }
}

export function syncAddProfile(name: string, startDate: string, isFirst: boolean) {
  upsertProfile(name, startDate, isFirst).catch(() => {})
}

export function syncSetActiveProfile(name: string) {
  setActiveProfileRemote(name).catch(() => {})
}

export function syncDeleteProfile(name: string) {
  deleteProfileRemote(name).catch(() => {})
}

export function syncToggleWorkout(profileName: string, workoutId: string, completing: boolean) {
  toggleWorkoutRemote(profileName, workoutId, completing).catch(() => {})
}

export function syncMoveWorkout(profileName: string, weekNum: number, workoutId: string, newDay: string) {
  setDayOverrideRemote(profileName, weekNum, workoutId, newDay).catch(() => {})
}

export function syncResetWeek(profileName: string, weekNum: number) {
  resetWeekRemote(profileName, weekNum).catch(() => {})
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
  const dayOverrides = { ...data.dayOverrides }
  delete completed[name]
  delete dayOverrides[name]
  return {
    ...data,
    profiles,
    completed,
    dayOverrides,
    activeProfile: data.activeProfile === name ? (profiles[0]?.name || null) : data.activeProfile,
  }
}

export function moveWorkout(data: UserData, profile: string, weekNum: number, workoutId: string, newDay: string): UserData {
  const profileOverrides = { ...(data.dayOverrides[profile] || {}) }
  const weekOverrides = { ...(profileOverrides[weekNum] || {}) }
  weekOverrides[workoutId] = newDay
  profileOverrides[weekNum] = weekOverrides
  return { ...data, dayOverrides: { ...data.dayOverrides, [profile]: profileOverrides } }
}

export function resetWeek(data: UserData, profile: string, weekNum: number): UserData {
  const profileOverrides = { ...(data.dayOverrides[profile] || {}) }
  delete profileOverrides[weekNum]
  return { ...data, dayOverrides: { ...data.dayOverrides, [profile]: profileOverrides } }
}

export function hasWeekOverrides(data: UserData, profile: string, weekNum: number): boolean {
  const weekOverrides = data.dayOverrides[profile]?.[weekNum]
  return !!weekOverrides && Object.keys(weekOverrides).length > 0
}

export interface ResolvedWorkout {
  id: string
  day: string
  originalDay: string
  sport: string
  type: string
  title: string
  description: string
  hasTransitionRun?: boolean
  transitionDesc?: string
  moved: boolean
}

export function resolveWeekWorkouts(
  data: UserData,
  profile: string,
  weekNum: number,
  workouts: { id: string; day: string; sport: string; type: string; title: string; description: string; hasTransitionRun?: boolean; transitionDesc?: string }[]
): ResolvedWorkout[] {
  const overrides = data.dayOverrides[profile]?.[weekNum] || {}

  return workouts.map(w => {
    const newDay = overrides[w.id]
    return {
      ...w,
      originalDay: w.day,
      day: newDay ?? w.day,
      moved: !!newDay,
    }
  })
}
