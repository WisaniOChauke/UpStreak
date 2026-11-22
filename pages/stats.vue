<template>
  <div class="max-w-2xl mx-auto">

    <div class="mb-8">
      <h1 class="text-3xl font-semibold text-stone-800 dark:text-stone-100 tracking-tight">Stats</h1>
      <p class="text-stone-400 mt-1 text-sm">Your progress at a glance</p>
    </div>

    <!-- XP + Level + Journal -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="card dark:bg-stone-900 dark:border-stone-800 p-5 text-center">
        <p class="text-3xl font-bold text-amber-500">{{ xp }}</p>
        <p class="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wide">Total XP</p>
      </div>
      <div class="card dark:bg-stone-900 dark:border-stone-800 p-5 text-center">
        <p class="text-3xl font-bold text-stone-800 dark:text-stone-100">{{ level }}</p>
        <p class="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wide">Level</p>
      </div>
      <div class="card dark:bg-stone-900 dark:border-stone-800 p-5 text-center">
        <p class="text-3xl font-bold text-stone-800 dark:text-stone-100">{{ journal.length }}</p>
        <p class="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wide">Journal Entries</p>
      </div>
    </div>

    <!-- Weekly Review -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-6 mb-6">
      <h2 class="text-sm font-semibold text-stone-600 dark:text-stone-300 mb-4">Weekly Review</h2>
      <div class="flex items-end gap-2 h-20">
        <div
          v-for="day in weeklyStats"
          :key="day.date"
          class="flex-1 flex flex-col items-center gap-1.5"
        >
          <div class="w-full bg-stone-100 dark:bg-stone-700 rounded-md relative" style="height: 56px;">
            <div
              class="absolute bottom-0 w-full bg-amber-400 rounded-md transition-all duration-500"
              :style="{ height: day.total ? ((day.completed / day.total) * 100) + '%' : '0%' }"
            />
          </div>
          <span class="text-xs text-stone-400">{{ day.label }}</span>
        </div>
      </div>
      <div class="flex items-center justify-between mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
        <span class="text-xs text-stone-400">
          {{ weekTotal }} habits completed this week
        </span>
        <span class="text-xs font-semibold text-amber-500">
          {{ weekPct }}% avg completion
        </span>
      </div>
    </div>

    <!-- Mood Trend -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-6 mb-6">
      <h2 class="text-sm font-semibold text-stone-600 dark:text-stone-300 mb-4">Mood Trend</h2>
      <div v-if="moodHistory.length > 1" style="height: 160px">
        <MoodChart />
      </div>
      <p v-else class="text-sm text-stone-400 text-center py-6">Write at least 2 journal entries to see your mood trend.</p>
    </div>

    <!-- Heatmap -->
    <div class="mb-6">
      <HabitHeatmap />
    </div>

    <!-- Habit Streaks -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-6 mb-6">
      <h2 class="text-sm font-semibold text-stone-600 dark:text-stone-300 mb-4">Habit Streaks</h2>
      <div class="flex flex-col gap-4">
        <div v-for="habit in habits" :key="habit.id">
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center gap-2">
              <span class="text-base">{{ habit.icon }}</span>
              <span class="text-sm font-medium text-stone-700 dark:text-stone-200">{{ habit.name }}</span>
            </div>
            <span class="text-sm font-semibold text-amber-500">🔥 {{ habit.streak }}</span>
          </div>
          <div class="w-full bg-stone-100 dark:bg-stone-700 rounded-full h-1.5">
            <div class="bg-amber-400 h-1.5 rounded-full transition-all duration-500" :style="{ width: Math.min((habit.streak / 30) * 100, 100) + '%' }" />
          </div>
        </div>
      </div>
    </div>

    <!-- Achievements -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-stone-600 dark:text-stone-300">Achievements</h2>
        <span class="badge bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
          {{ unlockedAchievements.length }} / {{ achievements.length }}
        </span>
      </div>
      <div class="grid grid-cols-1 gap-2">
        <AchievementBadge v-for="a in achievements" :key="a.id" :achievement="a" />
      </div>
    </div>

    <!-- Reminder Settings -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-6">
      <h2 class="text-sm font-semibold text-stone-600 dark:text-stone-300 mb-4">🔔 Daily Reminder</h2>
      <div class="flex items-center gap-4">
        <input
          v-model="reminderTime"
          type="time"
          class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 w-36"
        />
        <button
          v-if="!remindersEnabled"
          class="btn-primary"
          @click="enableReminder"
        >
          Enable
        </button>
        <button
          v-else
          class="btn-ghost dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800"
          @click="reminders.disable()"
        >
          Disable
        </button>
        <span v-if="remindersEnabled" class="text-xs text-amber-500 font-medium">Active ✓</span>
      </div>
      <p class="text-xs text-stone-400 mt-2">You'll get a browser notification at this time every day.</p>
      <p v-if="permissionDenied" class="text-xs text-red-400 mt-1">Notifications blocked — please allow them in your browser settings.</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useUpstreakStore } from '~/stores/upstreak'
import { storeToRefs } from 'pinia'

const store = useUpstreakStore()
const { xp, level, habits, goals, journal, achievements, unlockedAchievements, weeklyStats, remindersEnabled, moodHistory } = storeToRefs(store)

const reminders = useReminders()
const reminderTime = ref(store.reminderTime)
const permissionDenied = ref(false)

const enableReminder = async () => {
  const ok = await reminders.enable(reminderTime.value)
  if (!ok) permissionDenied.value = true
}

const weekTotal = computed(() => weeklyStats.value.reduce((s, d) => s + d.completed, 0))
const weekPct = computed(() => {
  const total = weeklyStats.value.reduce((s, d) => s + d.total, 0)
  return total ? Math.round((weekTotal.value / total) * 100) : 0
})
</script>
