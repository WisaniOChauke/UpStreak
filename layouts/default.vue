<template>
  <div :class="darkMode ? 'dark' : ''" class="min-h-screen">
    <div class="min-h-screen flex bg-stone-50 dark:bg-stone-950 transition-colors duration-300">

      <!-- Sidebar -->
      <aside class="w-60 shrink-0 bg-white dark:bg-stone-900 border-r border-stone-100 dark:border-stone-800 flex flex-col py-6 px-4 fixed h-full transition-colors duration-300">

        <!-- Logo -->
        <div class="flex items-center gap-2.5 px-2 mb-8">
          <div class="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.728 12.728.707.707M3 12h1m16 0h1M4.927 19.073l.707-.707M18.364 5.636l.707-.707" />
            </svg>
          </div>
          <span class="text-lg font-semibold text-stone-800 dark:text-stone-100 tracking-tight">Dayloom</span>
        </div>

        <!-- Nav -->
        <nav class="flex flex-col gap-1 flex-1">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
            :class="$route.path === item.to
              ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800'"
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Dark mode toggle -->
        <button
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors mb-3"
          @click="store.toggleDarkMode()"
        >
          <svg v-if="darkMode" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.728 12.728.707.707M3 12h1m16 0h1" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          {{ darkMode ? 'Light mode' : 'Dark mode' }}
        </button>

        <!-- XP Badge -->
        <div class="card dark:bg-stone-800 dark:border-stone-700 p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide">Level {{ level }}</span>
            <span class="text-xs text-amber-500 font-semibold">{{ xp }} XP</span>
          </div>
          <div class="w-full bg-stone-100 dark:bg-stone-700 rounded-full h-1.5">
            <div class="bg-amber-400 h-1.5 rounded-full transition-all duration-500" :style="{ width: xpPercent + '%' }" />
          </div>
          <p class="text-xs text-stone-400 mt-1.5">{{ xpToNext }} XP to next level</p>
        </div>

      </aside>

      <!-- Main -->
      <main class="flex-1 ml-60 p-8 min-h-screen">
        <slot />
      </main>

    </div>
  </div>

  <!-- Profile Setup Modal -->
  <div v-if="showProfileSetup" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl p-8 w-full max-w-sm mx-4 shadow-xl">
      <div class="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center mb-5">
        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.728 12.728.707.707M3 12h1m16 0h1" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-stone-800 dark:text-stone-100 mb-1">Welcome to Dayloom</h2>
      <p class="text-sm text-stone-400 mb-6">What should we call you?</p>
      <input
        v-model="nameInput"
        class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 w-full mb-4"
        placeholder="Your name"
        @keyup.enter="saveName"
        autofocus
      />
      <button class="btn-primary w-full" :disabled="!nameInput.trim()" @click="saveName">Let's go 🚀</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDayloomStore } from '~/stores/dayloom'
import { storeToRefs } from 'pinia'

const store = useDayloomStore()
const { xp, level, xpPercent, xpToNext, darkMode, profile } = storeToRefs(store)

const showProfileSetup = computed(() => !profile.value.name)
const nameInput = ref('')

const saveName = () => {
  if (!nameInput.value.trim()) return
  store.setName(nameInput.value.trim())
}

const nav = [
  { to: '/',        label: 'Today',   icon: resolveComponent('IconToday') },
  { to: '/goals',   label: 'Goals',   icon: resolveComponent('IconGoals') },
  { to: '/journal', label: 'Journal', icon: resolveComponent('IconJournal') },
  { to: '/stats',   label: 'Stats',   icon: resolveComponent('IconStats') },
]
</script>
