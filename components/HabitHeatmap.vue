<template>
  <div class="card p-6">
    <h2 class="text-sm font-semibold text-stone-600 mb-4">Activity Heatmap — Last 12 Weeks</h2>
    <div class="flex gap-1 overflow-x-auto pb-1">
      <div v-for="(week, wi) in grid" :key="wi" class="flex flex-col gap-1">
        <div
          v-for="(day, di) in week"
          :key="di"
          class="w-4 h-4 rounded-sm transition-colors duration-150"
          :class="cellColor(day.pct)"
          :title="day.date ? `${day.date}: ${day.completed}/${day.total} habits` : ''"
        />
      </div>
    </div>
    <div class="flex items-center gap-2 mt-3">
      <span class="text-xs text-stone-400">Less</span>
      <div v-for="c in scale" :key="c" class="w-3 h-3 rounded-sm" :class="c" />
      <span class="text-xs text-stone-400">More</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDayloomStore } from '~/stores/dayloom'
import { storeToRefs } from 'pinia'

const { habits } = storeToRefs(useDayloomStore())

const scale = ['bg-stone-100', 'bg-amber-100', 'bg-amber-200', 'bg-amber-300', 'bg-amber-400']

const cellColor = (pct: number | null) => {
  if (pct === null) return 'bg-transparent'
  if (pct === 0)    return 'bg-stone-100 dark:bg-stone-700'
  if (pct < 0.25)   return 'bg-amber-100'
  if (pct < 0.5)    return 'bg-amber-200'
  if (pct < 0.75)   return 'bg-amber-300'
  return 'bg-amber-400'
}

const grid = computed(() => {
  const weeks: { date: string | null; completed: number; total: number; pct: number | null }[][] = []
  const today = new Date()
  const totalDays = 84 // 12 weeks
  const startDay = new Date(today)
  startDay.setDate(today.getDate() - totalDays + 1)

  // pad to start on Sunday
  const startOffset = startDay.getDay()
  const cells: { date: string | null; completed: number; total: number; pct: number | null }[] = [
    ...Array(startOffset).fill({ date: null, completed: 0, total: 0, pct: null }),
  ]

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDay)
    d.setDate(startDay.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    const completed = habits.value.filter(h => h.completedDates.includes(dateStr)).length
    const total = habits.value.length
    cells.push({ date: dateStr, completed, total, pct: total > 0 ? completed / total : 0 })
  }

  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
})
</script>
