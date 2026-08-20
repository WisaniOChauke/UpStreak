import { useDayloomStore } from '~/stores/dayloom'

export const useReminders = () => {
  const store = useDayloomStore()
  const permission = ref<NotificationPermission>('default')

  const requestPermission = async () => {
    if (!process.client || !('Notification' in window)) return false
    const result = await Notification.requestPermission()
    permission.value = result
    return result === 'granted'
  }

  const scheduleReminder = (time: string) => {
    if (!process.client || permission.value !== 'granted') return
    const [hours, minutes] = time.split(':').map(Number)
    const now = new Date()
    const next = new Date()
    next.setHours(hours, minutes, 0, 0)
    if (next <= now) next.setDate(next.getDate() + 1)
    setTimeout(() => {
      new Notification('Dayloom 🌟', { body: "Time to check in on your habits!" })
      if (store.remindersEnabled) scheduleReminder(time)
    }, next.getTime() - now.getTime())
  }

  const enable = async (time: string) => {
    const granted = await requestPermission()
    if (!granted) return false
    store.setReminder(time, true)
    scheduleReminder(time)
    return true
  }

  const disable = () => store.setReminder(store.reminderTime, false)

  onMounted(() => {
    if (!process.client || !('Notification' in window)) return
    permission.value = Notification.permission
    if (store.remindersEnabled && permission.value === 'granted') {
      scheduleReminder(store.reminderTime)
    }
  })

  return { permission, enable, disable }
}
