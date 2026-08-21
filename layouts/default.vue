<template>
  <div :class="[darkMode ? 'dark' : '', `theme-${theme}`]" class="min-h-screen" style="background-color: var(--bg-app); color: var(--text-primary); transition: background-color 0.3s, color 0.3s">
    <div class="min-h-screen flex transition-colors duration-300" style="background-color: var(--bg-app)">

      <!-- Sidebar (desktop only) -->
      <aside class="hidden md:flex w-60 shrink-0 border-r flex-col py-6 px-4 fixed h-full transition-colors duration-300" style="background-color: var(--bg-sidebar); border-color: var(--border)">

        <!-- Logo -->
        <div class="flex items-center gap-2.5 px-2 mb-8">
          <div class="w-8 h-8 rounded-xl flex items-center justify-center" style="background-color: var(--accent)">
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.728 12.728.707.707M3 12h1m16 0h1M4.927 19.073l.707-.707M18.364 5.636l.707-.707" />
            </svg>
          </div>
          <span class="text-lg font-semibold tracking-tight" style="color: var(--text-primary)">Dayloom</span>
        </div>

        <!-- Nav -->
        <nav class="flex flex-col gap-1 flex-1">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            :style="$route.path === item.to
              ? { backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }
              : { color: 'var(--text-muted)' }"
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
        <div class="card p-4 cursor-pointer hover:shadow-card-hover transition-shadow" @click="showRanks = true">
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-1.5">
              <span class="text-base">{{ rank.icon }}</span>
              <span class="text-xs font-bold" style="color: var(--accent)">{{ rank.title }}</span>
            </div>
            <span class="text-xs font-semibold" style="color: var(--text-muted)">Lv {{ level }}</span>
          </div>
          <p class="text-xs mb-2" style="color: var(--text-subtle)">
            {{ level < 10 ? `Next: ${nextRank.icon} ${nextRank.title}` : '🌟 Max rank reached!' }}
          </p>
          <div class="w-full rounded-full h-1.5" style="background-color: var(--border)">
            <div class="h-1.5 rounded-full transition-all duration-500" :style="{ width: xpPercent + '%', backgroundColor: 'var(--accent)' }" />
          </div>
          <p class="text-xs mt-1.5" style="color: var(--text-muted)">{{ xpToNext }} XP to next level · {{ xp }} total</p>
        </div>

      </aside>

      <!-- Main -->
      <main class="flex-1 md:ml-60 p-5 md:p-8 pb-24 md:pb-8 min-h-screen">
        <slot />
      </main>

      <!-- Bottom nav (mobile only) -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 py-2 border-t z-40" style="background-color: var(--bg-sidebar); border-color: var(--border)">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
          :style="$route.path === item.to
            ? { color: 'var(--accent)' }
            : { color: 'var(--text-muted)' }"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span class="text-[10px] font-medium">{{ item.label }}</span>
        </NuxtLink>
      </nav>

    </div>
  </div>

  <!-- Ranks overview modal -->
  <Transition name="suggestions">
    <div v-if="showRanks" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showRanks = false">
      <div class="rounded-3xl w-full max-w-sm mx-4 shadow-2xl overflow-hidden" style="background-color: var(--bg-card); border: 1px solid var(--border)">
        <div class="flex items-center justify-between p-5 border-b" style="border-color: var(--border)">
          <div>
            <h2 class="text-base font-bold" style="color: var(--text-primary)">Discipline Ranks</h2>
            <p class="text-xs mt-0.5" style="color: var(--text-muted)">200 XP per level</p>
          </div>
          <button class="w-7 h-7 flex items-center justify-center rounded-xl transition-colors" style="color: var(--text-muted)" @click="showRanks = false">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="p-3 flex flex-col gap-1.5 max-h-96 overflow-y-auto">
          <div
            v-for="r in ranks"
            :key="r.min"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
            :style="level >= r.min
              ? { backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent-ring)' }
              : { backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', opacity: '0.5' }"
          >
            <span class="text-xl w-8 text-center">{{ r.icon }}</span>
            <div class="flex-1">
              <p class="text-sm font-semibold" style="color: var(--text-primary)">{{ r.title }}</p>
              <p class="text-xs" style="color: var(--text-muted)">Level {{ r.min }} · {{ (r.min - 1) * 200 }} XP required</p>
            </div>
            <div v-if="level === r.min" class="text-xs font-bold px-2 py-0.5 rounded-full" style="background-color: var(--accent); color: #fff">You</div>
            <svg v-else-if="level > r.min" class="w-4 h-4" style="color: var(--accent)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            <svg v-else class="w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10M12 3a9 9 0 100 18A9 9 0 0012 3z"/></svg>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Rank-up celebration -->
  <Transition name="suggestions">
    <div v-if="rankUpData" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" @click="rankUpData = null">
      <div class="rounded-3xl p-8 w-full max-w-sm mx-4 text-center shadow-2xl" style="background-color: var(--bg-card); border: 1px solid var(--border)">
        <div class="text-6xl mb-4">{{ rankUpData.icon }}</div>
        <p class="text-xs font-semibold uppercase tracking-widest mb-1" style="color: var(--accent)">Rank Up!</p>
        <h2 class="text-2xl font-bold mb-2" style="color: var(--text-primary)">{{ rankUpData.title }}</h2>
        <p class="text-sm mb-1" style="color: var(--text-muted)">You reached Level {{ level }}</p>
        <p class="text-xs mb-6" style="color: var(--text-subtle)">Keep building your discipline. The streak continues.</p>
        <button class="btn-primary w-full" @click="rankUpData = null">Let's keep going 🚀</button>
      </div>
    </div>
  </Transition>

  <!-- Profile Setup Modal -->
  <div v-if="showProfileSetup" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl p-8 w-full max-w-sm mx-4 shadow-xl">
      <template v-if="onboardStep === 1">
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
        <button class="btn-primary w-full" :disabled="!nameInput.trim()" @click="saveName">Continue →</button>
        <p class="text-xs text-center mt-4" style="color: var(--text-muted)">💾 Your data is saved locally on this device. Sign-in & cloud sync coming in v2.</p>
      </template>

      <template v-else-if="onboardStep === 2">
        <p class="text-2xl mb-3">🎯</p>
        <h2 class="text-xl font-semibold text-stone-800 dark:text-stone-100 mb-1">Add your first habit</h2>
        <p class="text-sm text-stone-400 mb-6">What's one thing you want to do every day?</p>
        <div class="flex flex-col gap-3 mb-4">
          <input v-model="firstHabit.name" class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100" placeholder="e.g. Morning walk" />
          <div class="flex gap-3">
            <input v-model="firstHabit.icon" class="input dark:bg-stone-800 dark:border-stone-700 w-20 text-center text-xl" placeholder="🎯" maxlength="2" />
            <select v-model="firstHabit.category" class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 flex-1">
              <option value="health">💧 Health</option>
              <option value="fitness">🏋️ Fitness</option>
              <option value="learning">📖 Learning</option>
              <option value="work">💼 Work</option>
              <option value="personal">🌟 Personal</option>
              <option value="other">📦 Other</option>
            </select>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="btn-ghost flex-1" @click="onboardStep = 3">Skip</button>
          <button class="btn-primary flex-1" @click="addFirstHabit">Add &amp; finish 🎉</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDayloomStore } from '~/stores/dayloom'
import { storeToRefs } from 'pinia'

const store = useDayloomStore()
const { xp, level, xpPercent, xpToNext, darkMode, profile, theme, rank } = storeToRefs(store)
const { fire: fireConfetti } = useConfetti()

const ranks = [
  { min: 1,  icon: '🌱', title: 'Wanderer' },
  { min: 2,  icon: '📖', title: 'Apprentice' },
  { min: 3,  icon: '🔍', title: 'Seeker' },
  { min: 4,  icon: '🎯', title: 'Focused' },
  { min: 5,  icon: '💪', title: 'Disciplined' },
  { min: 6,  icon: '⚔️',  title: 'Warrior' },
  { min: 7,  icon: '🧘', title: 'Sage' },
  { min: 8,  icon: '🌙', title: 'Monk' },
  { min: 9,  icon: '⚡',  title: 'Ascetic' },
  { min: 10, icon: '🌟', title: 'Enlightened' },
]

const nextRank = computed(() => ranks.find(r => r.min === level.value + 1) ?? ranks[ranks.length - 1])

const rankUpData = ref<{ icon: string; title: string } | null>(null)
const showRanks = ref(false)

watch(level, (newLv, oldLv) => {
  if (newLv > oldLv) {
    const r = ranks.find(r => r.min === newLv)
    if (r) {
      rankUpData.value = r
      fireConfetti()
    }
  }
})

onMounted(() => store.migrateHabits())

const showProfileSetup = computed(() => !profile.value.name)
const nameInput = ref('')
const onboardStep = ref(profile.value.name ? 3 : 1)
const firstHabit = ref({ name: '', icon: '🎯', category: 'health', xpReward: 15, color: 'amber' })

const saveName = () => {
  if (!nameInput.value.trim()) return
  store.setName(nameInput.value.trim())
  onboardStep.value = 2
}

const addFirstHabit = () => {
  if (firstHabit.value.name.trim()) store.addHabit(firstHabit.value as any)
  onboardStep.value = 3
}

const nav = [
  { to: '/',        label: 'Today',   icon: resolveComponent('IconToday') },
  { to: '/goals',   label: 'Goals',   icon: resolveComponent('IconGoals') },
  { to: '/journal', label: 'Journal', icon: resolveComponent('IconJournal') },
  { to: '/stats',   label: 'Stats',   icon: resolveComponent('IconStats') },
  { to: '/weekly',  label: 'Weekly',  icon: resolveComponent('IconStats') },
  { to: '/profile', label: 'Profile', icon: resolveComponent('IconToday') },
]
</script>
