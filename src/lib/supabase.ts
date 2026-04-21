import { createClient } from '@supabase/supabase-js'
import type { UserData, Profile, CompletedWorkout, SwapMap } from '../store'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, key)

// ─── Fetch full UserData for current user ──────────

export async function fetchUserData(): Promise<UserData> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { profiles: [], activeProfile: null, completed: {}, swaps: {} }

  const [{ data: profiles }, { data: completed }, { data: swaps }] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user.id),
    supabase.from('completed_workouts').select('*').eq('user_id', user.id),
    supabase.from('swaps').select('*').eq('user_id', user.id),
  ])

  const profileList: Profile[] = (profiles || []).map(p => ({
    name: p.name,
    startDate: p.start_date,
  }))

  const activeRow = (profiles || []).find(p => p.is_active)
  const activeProfile = activeRow?.name ?? profileList[0]?.name ?? null

  const completedMap: Record<string, CompletedWorkout[]> = {}
  for (const c of completed || []) {
    if (!completedMap[c.profile_name]) completedMap[c.profile_name] = []
    completedMap[c.profile_name].push({
      workoutId: c.workout_id,
      completedAt: c.completed_at,
    })
  }

  const swapMap: Record<string, SwapMap> = {}
  for (const s of swaps || []) {
    if (!swapMap[s.profile_name]) swapMap[s.profile_name] = {}
    if (!swapMap[s.profile_name][s.week_num]) swapMap[s.profile_name][s.week_num] = []
    swapMap[s.profile_name][s.week_num].push([s.id_a, s.id_b])
  }

  return { profiles: profileList, activeProfile, completed: completedMap, swaps: swapMap }
}

// ─── Profile operations ──────────

export async function upsertProfile(name: string, startDate: string, isActive: boolean) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  if (isActive) {
    await supabase.from('profiles').update({ is_active: false }).eq('user_id', user.id)
  }

  await supabase.from('profiles').upsert(
    { user_id: user.id, name, start_date: startDate, is_active: isActive },
    { onConflict: 'user_id,name' }
  )
}

export async function setActiveProfileRemote(name: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('profiles').update({ is_active: false }).eq('user_id', user.id)
  await supabase.from('profiles').update({ is_active: true }).eq('user_id', user.id).eq('name', name)
}

export async function deleteProfileRemote(name: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('profiles').delete().eq('user_id', user.id).eq('name', name)
  await supabase.from('completed_workouts').delete().eq('user_id', user.id).eq('profile_name', name)
  await supabase.from('swaps').delete().eq('user_id', user.id).eq('profile_name', name)
}

// ─── Workout completion ──────────

export async function toggleWorkoutRemote(profileName: string, workoutId: string, completing: boolean) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  if (completing) {
    await supabase.from('completed_workouts').upsert(
      { user_id: user.id, profile_name: profileName, workout_id: workoutId, completed_at: new Date().toISOString() },
      { onConflict: 'user_id,profile_name,workout_id' }
    )
  } else {
    await supabase.from('completed_workouts').delete()
      .eq('user_id', user.id)
      .eq('profile_name', profileName)
      .eq('workout_id', workoutId)
  }
}

// ─── Swaps ──────────

export async function addSwapRemote(profileName: string, weekNum: number, idA: string, idB: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('swaps').insert({
    user_id: user.id,
    profile_name: profileName,
    week_num: weekNum,
    id_a: idA,
    id_b: idB,
  })
}
