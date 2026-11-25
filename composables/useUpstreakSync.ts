import { useUpstreakStore } from '~/stores/upstreak'

type UpstreakState = ReturnType<typeof useUpstreakStore>['$state']

interface SyncConflict {
  local: UpstreakState
  cloud: UpstreakState
  cloudUpdatedAt: string
}

interface CloudSnapshot {
  state: UpstreakState
  updatedAt: string
}

type SyncStatus = 'disabled' | 'loading' | 'ready' | 'conflict' | 'error'

function isUpstreakState(value: unknown): value is UpstreakState {
  if (typeof value !== 'object' || value === null) return false

  const state = value as Record<string, unknown>
  return typeof state.xp === 'number'
    && typeof state.darkMode === 'boolean'
    && typeof state.profile === 'object'
    && state.profile !== null
    && Array.isArray(state.habits)
    && Array.isArray(state.goals)
    && Array.isArray(state.journal)
    && Array.isArray(state.achievements)
    && Array.isArray(state.dismissedSuggestions)
    && Array.isArray(state.removedHabits)
}

function hasLocalProgress(state: UpstreakState): boolean {
  return Boolean(
    state.profile.name
    || state.profile.avatar !== '🌅'
    || state.habits.length
    || state.goals.length
    || state.journal.length
    || state.xp
    || state.darkMode
    || state.theme !== 'default'
    || state.remindersEnabled
    || state.reminderTime !== '08:00'
    || state.dismissedSuggestions.length
    || state.removedHabits.length
    || state.achievements.some(achievement => achievement.unlockedAt !== null),
  )
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right))
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableSerialize(item)}`).join(',')}}`
  }
  return JSON.stringify(value) ?? 'null'
}

export function useUpstreakSync() {
  const store = useUpstreakStore()
  const status = useState<SyncStatus>('upstreak-sync-status', () =>
    isSupabaseConfigured() ? 'loading' : 'disabled',
  )
  const errorMessage = useState('upstreak-sync-error', () => '')
  const conflict = useState<SyncConflict | null>('upstreak-sync-conflict', () => null)
  const email = useState<string | null>('upstreak-account-email', () => null)
  const updatedAt = ref<string | null>(null)

  let unsubscribe: (() => void) | undefined
  let saveTimer: ReturnType<typeof setTimeout> | undefined

  function watchStore(userId: string) {
    unsubscribe?.()
    unsubscribe = store.$subscribe((_mutation, state) => {
      if (status.value !== 'ready') return
      if (saveTimer) clearTimeout(saveTimer)
      const snapshot = JSON.parse(JSON.stringify(state)) as UpstreakState
      saveTimer = setTimeout(() => {
        void saveState(userId, snapshot, updatedAt.value).catch((error: unknown) => {
          errorMessage.value = error instanceof Error ? error.message : 'Unable to sync your changes.'
          status.value = 'error'
        })
      }, 700)
    }, { detached: true })
  }

  async function fetchCloudState(userId: string): Promise<CloudSnapshot | null> {
    const { data, error } = await useSupabaseClient()
      .from('user_data')
      .select('data, updated_at')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error
    if (!data) return null
    if (!isUpstreakState(data.data) || typeof data.updated_at !== 'string') {
      throw new Error('Your saved account data has an unexpected format.')
    }
    return { state: data.data, updatedAt: data.updated_at }
  }

  async function insertInitialState(userId: string, local: UpstreakState): Promise<string> {
    const { data, error } = await useSupabaseClient()
      .from('user_data')
      .insert({ user_id: userId, data: local })
      .select('updated_at')
      .single()

    if (error) throw error
    return data.updated_at
  }

  function applyCloudState(cloud: UpstreakState) {
    store.$reset()
    store.$patch(cloud)
  }

  async function saveState(userId: string, state: UpstreakState, expectedUpdatedAt: string | null): Promise<string> {
    if (!expectedUpdatedAt) throw new Error('Your sync session is not ready. Retry before saving.')

    const { data, error } = await useSupabaseClient()
      .from('user_data')
      .update({ data: state })
      .eq('user_id', userId)
      .eq('updated_at', expectedUpdatedAt)
      .select('updated_at')
      .maybeSingle()

    if (error) throw error
    if (!data) throw new Error('Your account data changed on another device. Retry to compare before saving.')
    updatedAt.value = data.updated_at
    return data.updated_at
  }

  async function startSync() {
    if (!isSupabaseConfigured()) {
      status.value = 'disabled'
      return
    }

    if (saveTimer) clearTimeout(saveTimer)
    unsubscribe?.()
    status.value = 'loading'
    errorMessage.value = ''
    conflict.value = null
    updatedAt.value = null

    try {
      const { data: sessionData, error: sessionError } = await useSupabaseClient().auth.getSession()
      if (sessionError) throw sessionError
      const user = sessionData.session?.user
      if (!user) {
        await navigateTo('/login')
        return
      }

      email.value = user.email ?? null
      const local = JSON.parse(JSON.stringify(store.$state)) as UpstreakState
      const cloud = await fetchCloudState(user.id)

      if (cloud) {
        updatedAt.value = cloud.updatedAt
        if (hasLocalProgress(local) && stableSerialize(local) !== stableSerialize(cloud.state)) {
          conflict.value = { local, cloud: cloud.state, cloudUpdatedAt: cloud.updatedAt }
          status.value = 'conflict'
          return
        }
        applyCloudState(cloud.state)
      } else {
        try {
          updatedAt.value = await insertInitialState(user.id, local)
        } catch (insertError) {
          const concurrentCloudState = await fetchCloudState(user.id)
          if (!concurrentCloudState) throw insertError
          updatedAt.value = concurrentCloudState.updatedAt
          if (hasLocalProgress(local)) {
            conflict.value = {
              local,
              cloud: concurrentCloudState.state,
              cloudUpdatedAt: concurrentCloudState.updatedAt,
            }
            status.value = 'conflict'
            return
          }
          applyCloudState(concurrentCloudState.state)
        }
      }

      status.value = 'ready'
      watchStore(user.id)
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Unable to load your account data.'
      status.value = 'error'
    }
  }

  async function resolveConflict(choice: 'local' | 'cloud') {
    if (!conflict.value) return
    status.value = 'loading'
    errorMessage.value = ''

    try {
      const { data, error } = await useSupabaseClient().auth.getSession()
      if (error) throw error
      const user = data.session?.user
      if (!user) throw new Error('Your session expired. Please log in again.')

      if (choice === 'local') {
        updatedAt.value = conflict.value.cloudUpdatedAt
        await saveState(user.id, conflict.value.local, updatedAt.value)
      } else {
        applyCloudState(conflict.value.cloud)
        updatedAt.value = conflict.value.cloudUpdatedAt
      }
      conflict.value = null
      status.value = 'ready'
      watchStore(user.id)
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Unable to resolve the data conflict.'
      status.value = 'error'
    }
  }

  async function signOut() {
    try {
      if (saveTimer) {
        clearTimeout(saveTimer)
        saveTimer = undefined
      }

      const { data, error: sessionError } = await useSupabaseClient().auth.getSession()
      if (sessionError) throw sessionError
      const user = data.session?.user
      if (user && status.value === 'ready') {
        updatedAt.value = await saveState(
          user.id,
          JSON.parse(JSON.stringify(store.$state)) as UpstreakState,
          updatedAt.value,
        )
      }

      unsubscribe?.()
      unsubscribe = undefined

      const { error } = await useSupabaseClient().auth.signOut()
      if (error) throw error

      email.value = null
      await navigateTo('/login')
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Unable to log out safely. Your changes may not have synced.'
      status.value = 'error'
    }
  }

  onMounted(() => {
    void startSync()
  })

  onBeforeUnmount(() => {
    if (saveTimer) clearTimeout(saveTimer)
    unsubscribe?.()
  })

  return { status, errorMessage, conflict, email, startSync, resolveConflict, signOut }
}
