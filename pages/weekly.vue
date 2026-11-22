<template>
  <div class="max-w-2xl mx-auto">

    <div class="mb-8">
      <h1 class="text-3xl font-semibold text-stone-800 dark:text-stone-100 tracking-tight">Weekly Review</h1>
      <p class="text-stone-400 mt-1 text-sm">{{ weekLabel }}</p>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="card dark:bg-stone-900 dark:border-stone-800 p-5 text-center">
        <p class="text-3xl font-bold text-amber-500">{{ weekTotal }}</p>
        <p class="text-xs text-stone-400 mt-1 uppercase tracking-wide">Habits done</p>
      </div>
      <div class="card dark:bg-stone-900 dark:border-stone-800 p-5 text-center">
        <p class="text-3xl font-bold text-stone-800 dark:text-stone-100">{{ weekPct }}%</p>
        <p class="text-xs text-stone-400 mt-1 uppercase tracking-wide">Completion</p>
      </div>
      <div class="card dark:bg-stone-900 dark:border-stone-800 p-5 text-center">
        <p class="text-3xl font-bold text-stone-800 dark:text-stone-100">{{ weekJournal }}</p>
        <p class="text-xs text-stone-400 mt-1 uppercase tracking-wide">Journal entries</p>
      </div>
    </div>

    <!-- Daily breakdown -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-6 mb-6">
      <h2 class="text-sm font-semibold text-stone-600 dark:text-stone-300 mb-4">Daily Breakdown</h2>
      <div class="flex flex-col gap-3">
        <div v-for="day in weeklyStats" :key="day.date" class="flex items-center gap-4">
          <span class="text-xs text-stone-400 w-8 shrink-0">{{ day.label }}</span>
          <div class="flex-1 bg-stone-100 dark:bg-stone-700 rounded-full h-2">
            <div
              class="bg-amber-400 h-2 rounded-full transition-all duration-500"
              :style="{ width: day.total ? (day.completed / day.total * 100) + '%' : '0%' }"
            />
          </div>
          <span class="text-xs text-stone-500 dark:text-stone-400 w-12 text-right shrink-0">{{ day.completed }}/{{ day.total }}</span>
          <span class="text-base shrink-0">{{ dayMood(day.date) }}</span>
        </div>
      </div>
    </div>

    <!-- Best habit this week -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-6 mb-6">
      <h2 class="text-sm font-semibold text-stone-600 dark:text-stone-300 mb-4">🏆 Best Habit This Week</h2>
      <div v-if="bestHabit" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xl">{{ bestHabit.icon }}</div>
        <div>
          <p class="text-sm font-semibold text-stone-800 dark:text-stone-100">{{ bestHabit.name }}</p>
          <p class="text-xs text-stone-400">Completed {{ bestHabitCount }}x this week · 🔥 {{ bestHabit.streak }} day streak</p>
        </div>
      </div>
      <p v-else class="text-sm text-stone-400">No habits completed this week yet.</p>
    </div>

    <!-- This week's journal entries -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-6">
      <h2 class="text-sm font-semibold text-stone-600 dark:text-stone-300 mb-4">📓 This Week's Journal</h2>
      <div v-if="weekJournalEntries.length" class="flex flex-col gap-3">
        <div v-for="entry in weekJournalEntries" :key="entry.id" class="flex gap-3">
          <span class="text-lg shrink-0">{{ moodEmoji(entry.mood) }}</span>
          <div>
            <p class="text-xs text-stone-400 mb-0.5">{{ formatDate(entry.date) }}</p>
            <p class="text-sm text-stone-600 dark:text-stone-300 line-clamp-2">{{ entry.content }}</p>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-stone-400">No journal entries this week.</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useUpstreakStore } from '~/stores/upstreak'
import { storeToRefs } from 'pinia'

const store = useUpstreakStore()
const { habits, journal, weeklyStats } = storeToRefs(store)

const weekDates = computed(() => weeklyStats.value.map(d => d.date))

const weekLabel = computed(() => {
  const dates = weekDates.value
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(dates[0])} – ${fmt(dates[dates.length - 1])}`
})

const weekTotal = computed(() => weeklyStats.value.reduce((s, d) => s + d.completed, 0))
const weekPct = computed(() => {
  const total = weeklyStats.value.reduce((s, d) => s + d.total, 0)
  return total ? Math.round((weekTotal.value / total) * 100) : 0
})

const weekJournalEntries = computed(() =>
  journal.value.filter(e => weekDates.value.includes(e.date)).sort((a, b) => b.date.localeCompare(a.date))
)
const weekJournal = computed(() => weekJournalEntries.value.length)

const moods = [
  { value: 'great', emoji: '😄' }, { value: 'good', emoji: '🙂' },
  { value: 'okay', emoji: '😐' }, { value: 'bad', emoji: '😔' },
]
const moodEmoji = (mood: string) => moods.find(m => m.value === mood)?.emoji ?? '🙂'
const dayMood = (date: string) => {
  const entry = journal.value.find(e => e.date === date)
  return entry ? moodEmoji(entry.mood) : ''
}

const bestHabit = computed(() => {
  const dates = weekDates.value
  let best = habits.value[0]
  let bestCount = 0
  habits.value.forEach(h => {
    const count = h.completedDates.filter(d => dates.includes(d)).length
    if (count > bestCount) { bestCount = count; best = h }
  })
  return bestCount > 0 ? best : null
})

const bestHabitCount = computed(() => {
  if (!bestHabit.value) return 0
  return bestHabit.value.completedDates.filter(d => weekDates.value.includes(d)).length
})

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
</script>
