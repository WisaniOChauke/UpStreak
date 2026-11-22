<template>
  <div class="max-w-2xl mx-auto">

    <div class="mb-8">
      <h1 class="text-3xl font-semibold text-stone-800 dark:text-stone-100 tracking-tight">Profile</h1>
      <p class="text-stone-400 mt-1 text-sm">Manage your identity and preferences</p>
    </div>

    <!-- Avatar + Name -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-6 mb-5">
      <h2 class="text-sm font-semibold text-stone-600 dark:text-stone-300 mb-4">Identity</h2>

      <div class="flex items-center gap-5 mb-5">
        <button
          class="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-800 text-4xl flex items-center justify-center hover:scale-105 transition-transform"
          @click="showAvatarPicker = !showAvatarPicker"
        >{{ selectedAvatar }}</button>
        <div>
          <p class="text-sm font-medium text-stone-700 dark:text-stone-200">{{ profile.name || 'No name set' }}</p>
          <p class="text-xs text-stone-400 mt-0.5">{{ store.rank.icon }} {{ store.rank.title }} · Click avatar to change</p>
        </div>
      </div>

      <!-- Avatar picker -->
      <div v-if="showAvatarPicker" class="flex flex-wrap gap-2 mb-4 p-3 bg-stone-50 dark:bg-stone-800 rounded-xl">
        <button
          v-for="emoji in avatars"
          :key="emoji"
          class="w-10 h-10 rounded-xl text-2xl flex items-center justify-center hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          :class="selectedAvatar === emoji ? 'bg-amber-100 dark:bg-amber-900/30 ring-2 ring-amber-400' : ''"
          @click="selectedAvatar = emoji; showAvatarPicker = false"
        >{{ emoji }}</button>
      </div>

      <div class="flex flex-col gap-3">
        <input v-model="nameInput" class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100" placeholder="Your name" />
        <button class="btn-primary self-start" @click="save">Save changes</button>
      </div>
    </div>

    <!-- Theme -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-6 mb-5">
      <h2 class="text-sm font-semibold text-stone-600 dark:text-stone-300 mb-4">Theme</h2>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="t in themes"
          :key="t.value"
          class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left"
          :class="store.theme === t.value
            ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
            : 'border-stone-100 dark:border-stone-700 hover:border-stone-200 dark:hover:border-stone-600'"
          @click="store.setTheme(t.value)"
        >
          <span class="text-2xl">{{ t.icon }}</span>
          <div>
            <p class="text-sm font-medium text-stone-700 dark:text-stone-200">{{ t.label }}</p>
            <p class="text-xs text-stone-400">{{ t.desc }}</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Stats summary -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-6 mb-5">
      <h2 class="text-sm font-semibold text-stone-600 dark:text-stone-300 mb-4">Your Stats</h2>
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-2xl font-bold text-amber-500">{{ store.xp }}</p>
          <p class="text-xs text-stone-400 mt-0.5">Total XP</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-stone-800 dark:text-stone-100">{{ store.habits.length }}</p>
          <p class="text-xs text-stone-400 mt-0.5">Habits</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-stone-800 dark:text-stone-100">{{ store.journal.length }}</p>
          <p class="text-xs text-stone-400 mt-0.5">Journal entries</p>
        </div>
      </div>
    </div>

    <!-- Data Export -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-6 mb-5">
      <h2 class="text-sm font-semibold text-stone-600 dark:text-stone-300 mb-1">Export Data</h2>
      <p class="text-xs text-stone-400 mb-4">Download all your habits, goals and journal entries</p>
      <div class="flex gap-3">
        <button class="btn-ghost dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800" @click="exportJSON">Export JSON</button>
        <button class="btn-ghost dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800" @click="exportCSV">Export CSV</button>
      </div>
    </div>

    <!-- Danger zone -->
    <div class="card dark:bg-stone-900 border-red-100 dark:border-red-900/40 p-6">
      <h2 class="text-sm font-semibold text-red-500 mb-1">Danger Zone</h2>
      <p class="text-xs text-stone-400 mb-4">This will reset all your XP, streaks, journal entries and achievements. Your habits and goals will remain.</p>
      <button v-if="!confirmReset" class="btn-ghost text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" @click="confirmReset = true">
        Reset progress
      </button>
      <div v-else class="flex items-center gap-3">
        <span class="text-sm text-stone-500 dark:text-stone-400">Are you sure?</span>
        <button class="btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" @click="doReset">Yes, reset</button>
        <button class="btn-ghost" @click="confirmReset = false">Cancel</button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useUpstreakStore } from '~/stores/upstreak'
import type { Theme } from '~/stores/upstreak'
import { storeToRefs } from 'pinia'

const store = useUpstreakStore()
const { profile } = storeToRefs(store)

const nameInput = ref(profile.value.name)
const selectedAvatar = ref(profile.value.avatar || '🌅')
const showAvatarPicker = ref(false)
const confirmReset = ref(false)

const avatars = ['🌅','🌿','🔥','⚡','🎯','🌊','🦋','🌸','🏔️','🌙','⭐','🎨','🧠','💪','🚀','🎵','🌺','🦅','🐉','🌈']

const themes = [
  { value: 'default' as Theme, icon: '🌅', label: 'Default',  desc: 'Warm amber tones' },
  { value: 'forest'  as Theme, icon: '🌿', label: 'Forest',   desc: 'Calm greens' },
  { value: 'ocean'   as Theme, icon: '🌊', label: 'Ocean',    desc: 'Cool blues' },
  { value: 'minimal' as Theme, icon: '⬜', label: 'Minimal',  desc: 'Clean & simple' },
]

const save = () => {
  if (!nameInput.value.trim()) return
  store.setProfile(nameInput.value.trim(), selectedAvatar.value)
}

const doReset = () => {
  store.resetProgress()
  confirmReset.value = false
}

const exportJSON = () => {
  const data = { habits: store.habits, goals: store.goals, journal: store.journal }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'upstreak-export.json'
  a.click()
}

const exportCSV = () => {
  const rows = [
    ['Type', 'Name/Title', 'Date', 'Value'],
    ...store.habits.map(h => ['habit', h.name, '', `streak:${h.streak}`]),
    ...store.journal.map(e => ['journal', e.mood, e.date, e.content.replace(/,/g, ' ')]),
    ...store.goals.map(g => ['goal', g.title, g.dueDate, `${g.progress}/${g.target} ${g.unit}`]),
  ]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'upstreak-export.csv'
  a.click()
}
</script>
