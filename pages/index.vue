<template>
  <div class="max-w-2xl mx-auto">

    <!-- Header -->
    <div class="mb-8">
      <p class="text-sm text-stone-400 font-medium mb-1">{{ formattedDate }}</p>
      <h1 class="text-3xl font-semibold text-stone-800 dark:text-stone-100 tracking-tight">Good {{ greeting }}, {{ store.profile.name }} 👋</h1>
      <p class="text-stone-400 mt-1 text-sm">{{ completedToday }} of {{ habits.length }} habits done today</p>
    </div>

    <!-- Progress bar -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-5 mb-6">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-semibold text-stone-600 dark:text-stone-300">Today's Progress</span>
        <span class="text-sm font-semibold text-amber-500">{{ habits.length ? Math.round((completedToday / habits.length) * 100) : 0 }}%</span>
      </div>
      <div class="w-full bg-stone-100 dark:bg-stone-700 rounded-full h-2">
        <div
          class="bg-amber-400 h-2 rounded-full transition-all duration-500"
          :style="{ width: (habits.length ? (completedToday / habits.length) * 100 : 0) + '%' }"
        />
      </div>
      <p v-if="allDoneToday" class="text-xs text-amber-500 font-semibold mt-2">🎉 Perfect day! All habits complete!</p>
    </div>

    <!-- Habits -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold text-stone-700 dark:text-stone-200">Habits</h2>
        <button class="btn-ghost dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800 text-xs" @click="showAddHabit = true">+ Add habit</button>
      </div>

      <!-- Category filter -->
      <div class="flex gap-2 flex-wrap mb-4">
        <button
          v-for="cat in categories"
          :key="cat.value"
          class="px-3 py-1 rounded-full text-xs font-medium border transition-all"
          :class="activeCategory === cat.value
            ? 'bg-amber-400 border-amber-400 text-white'
            : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-300'"
          @click="activeCategory = cat.value"
        >{{ cat.icon }} {{ cat.label }}</button>
      </div>

      <!-- Category suggestions -->
      <Transition name="suggestions">
        <div v-if="activeCategory !== 'all' && visibleSuggestions.length" class="mb-5 p-3 rounded-2xl border" style="background-color: var(--accent-light); border-color: var(--border)">
          <p class="text-xs font-semibold uppercase tracking-wide mb-2 px-1" style="color: var(--text-muted)">
            {{ categories.find(c => c.value === activeCategory)?.icon }} Suggested
          </p>
          <div class="flex flex-col gap-1.5">
            <Transition v-for="s in visibleSuggestions" :key="s.name" name="suggestion-item">
              <div class="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border group/s" style="border-color: var(--border)">
                <div class="flex items-center gap-2">
                  <span class="text-base">{{ s.icon }}</span>
                  <div>
                    <p class="text-xs font-medium" style="color: var(--text-primary)">{{ s.name }}</p>
                    <p class="text-xs" style="color: var(--text-subtle)">{{ s.desc }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <button
                    class="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                    style="background-color: var(--accent); color: #fff"
                    @click="quickAdd(s)"
                  >+ Add</button>
                  <button
                    class="opacity-0 group-hover/s:opacity-100 w-5 h-5 flex items-center justify-center rounded-md transition-all hover:bg-red-50 dark:hover:bg-red-900/20"
                    style="color: var(--text-muted)"
                    title="Hide suggestion"
                    @click="store.dismissSuggestion(s.name)"
                  >
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>

      <!-- Recently removed habits -->
      <Transition name="suggestions">
        <div v-if="removedInCategory.length" class="mb-5 p-3 rounded-2xl border" style="border-color: var(--border); background-color: var(--bg-card)">
          <p class="text-xs font-semibold uppercase tracking-wide mb-2 px-1" style="color: var(--text-muted)">🕓 Recently removed</p>
          <div class="flex flex-col gap-1.5">
            <div v-for="h in removedInCategory" :key="h.id" class="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border" style="border-color: var(--border)">
              <div class="flex items-center gap-2">
                <span class="text-base">{{ h.icon }}</span>
                <p class="text-xs font-medium" style="color: var(--text-primary)">{{ h.name }}</p>
              </div>
              <button
                class="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                style="border: 1px solid var(--border); color: var(--text-muted)"
                @click="store.reAddHabit(h)"
              >Re-add</button>
            </div>
          </div>
        </div>
      </Transition>

      <div class="flex flex-col gap-2">
        <div
          v-for="(habit, index) in filteredHabits"
          :key="habit.id"
          class="card p-3 flex items-center gap-3 transition-all duration-150 group cursor-pointer"
          :class="habit.doneToday ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900' : ''"
          draggable="true"
          @dragstart="dragStart(index)"
          @dragover.prevent
          @drop="dragDrop(index)"
          @click="selectedHabit = habit"
        >
          <div
            class="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
            :class="habit.doneToday ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-stone-100 dark:bg-stone-800'"
          >{{ habit.icon }}</div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate" :class="habit.doneToday ? 'line-through text-stone-400' : ''"
              style="color: var(--text-primary)">{{ habit.name }}</p>
            <p class="text-xs" style="color: var(--text-subtle)">🔥 {{ habit.streak }} · +{{ habit.xpReward }} XP</p>
          </div>
          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer"
            :class="habit.doneToday ? 'bg-amber-400 border-amber-400' : 'border-stone-200 dark:border-stone-600'"
            @click.stop="toggle(habit.id)"
          >
            <svg v-if="habit.doneToday" class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <button
            class="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg text-stone-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shrink-0"
            @click.stop="removeHabit(habit)"
            title="Remove habit"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Journal -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-5">
      <h2 class="text-base font-semibold text-stone-700 dark:text-stone-200 mb-4">Today's Note</h2>
      <div class="flex gap-2 mb-4">
        <button
          v-for="m in moods"
          :key="m.value"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm border transition-all"
          :class="selectedMood === m.value
            ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400'
            : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-300'"
          @click="selectedMood = m.value"
        >{{ m.emoji }} {{ m.label }}</button>
      </div>
      <textarea v-model="journalText" class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 dark:placeholder-stone-500 resize-none h-28" placeholder="How's your day going?" />
      <div class="flex items-center justify-end gap-3 mt-3">
        <Transition name="suggestion-item">
          <span v-if="noteSaved" class="text-xs font-medium" style="color: var(--accent)">✓ Note saved!</span>
        </Transition>
        <button class="btn-primary" @click="saveEntry">Save note +10 XP</button>
      </div>
    </div>

    <!-- Add Habit Modal -->
    <div v-if="showAddHabit" class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showAddHabit = false">
      <div class="card dark:bg-stone-900 dark:border-stone-800 p-6 w-full max-w-sm mx-4">
        <h3 class="text-base font-semibold text-stone-800 dark:text-stone-100 mb-4">New Habit</h3>
        <div class="flex flex-col gap-3">
          <input v-model="newHabit.name" class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100" placeholder="Habit name" />
          <div class="flex gap-3">
            <input v-model="newHabit.icon" class="input dark:bg-stone-800 dark:border-stone-700 w-20 text-center text-xl" placeholder="🎯" maxlength="2" />
            <input v-model.number="newHabit.xpReward" class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100" type="number" placeholder="XP reward" />
          </div>
          <select v-model="newHabit.category" class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100">
            <option v-for="cat in categories.slice(1)" :key="cat.value" :value="cat.value">{{ cat.icon }} {{ cat.label }}</option>
          </select>
        </div>
        <div class="flex gap-2 mt-5 justify-end">
          <button class="btn-ghost" @click="showAddHabit = false">Cancel</button>
          <button class="btn-primary" @click="addHabit">Add Habit</button>
        </div>
      </div>
    </div>

    <!-- Habit Detail Modal -->
    <HabitDetail
      v-if="selectedHabit"
      :habit="selectedHabit"
      @close="selectedHabit = null"
      @toggle="toggle"
      @delete="store.deleteHabit"
    />

  </div>
</template>

<script setup lang="ts">
import { useDayloomStore } from '~/stores/dayloom'
import { storeToRefs } from 'pinia'

const store = useDayloomStore()
const { todayHabits, completedToday, habits, todayEntry, allDoneToday, removedHabits } = storeToRefs(store)
const { fire: fireConfetti } = useConfetti()

const now = new Date()
const hour = now.getHours()
const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
const formattedDate = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

const categories = [
  { value: 'all',      icon: '✨', label: 'All' },
  { value: 'health',   icon: '💧', label: 'Health' },
  { value: 'fitness',  icon: '🏋️', label: 'Fitness' },
  { value: 'learning', icon: '📖', label: 'Learning' },
  { value: 'work',     icon: '💼', label: 'Work' },
  { value: 'personal', icon: '🌟', label: 'Personal' },
  { value: 'other',    icon: '📦', label: 'Other' },
]

const activeCategory = ref('all')
const selectedHabit = ref<typeof todayHabits.value[0] | null>(null)

const categorySuggestions: Record<string, { name: string; icon: string; desc: string; xpReward: number }[]> = {
  fitness: [
    { name: 'Run 5km',           icon: '🏃', desc: 'Build cardio endurance',            xpReward: 30 },
    { name: 'Do 20 pushups',     icon: '💪', desc: 'Upper body strength daily',         xpReward: 20 },
    { name: '30-min workout',    icon: '🏋️', desc: 'Any exercise for 30 minutes',       xpReward: 25 },
    { name: 'Stretch 10 mins',   icon: '🧘', desc: 'Improve flexibility & recovery',    xpReward: 10 },
    { name: 'Walk 10,000 steps', icon: '🚶', desc: 'Stay active throughout the day',    xpReward: 20 },
    { name: 'Cycle 30 mins',     icon: '🚴', desc: 'Low-impact cardio',                 xpReward: 25 },
  ],
  health: [
    { name: 'Drink 2L water',  icon: '💧', desc: 'Stay hydrated every day',           xpReward: 10 },
    { name: 'Sleep by 10pm',   icon: '😴', desc: 'Consistent sleep schedule',         xpReward: 15 },
    { name: 'Eat vegetables',  icon: '🥦', desc: 'Include greens in every meal',      xpReward: 10 },
    { name: 'No junk food',    icon: '🚫', desc: 'Avoid processed & fast food',       xpReward: 20 },
    { name: 'Take vitamins',   icon: '💊', desc: 'Daily supplement routine',          xpReward: 10 },
    { name: 'Cold shower',     icon: '🚿', desc: 'Boost energy & alertness',          xpReward: 15 },
  ],
  learning: [
    { name: 'Read 20 mins',          icon: '📖', desc: 'Any book — fiction or non-fiction',  xpReward: 15 },
    { name: 'Learn a new language',  icon: '🌍', desc: 'Duolingo or any language app',       xpReward: 20 },
    { name: 'Try a new recipe',      icon: '🍳', desc: 'Cook something you have never made', xpReward: 20 },
    { name: 'Watch a documentary',   icon: '🎬', desc: 'Learn something new visually',       xpReward: 10 },
    { name: 'Practice an instrument',icon: '🎸', desc: '15+ mins of music practice',         xpReward: 20 },
    { name: 'Online course lesson',  icon: '💻', desc: 'One lesson from any online course',  xpReward: 15 },
  ],
  personal: [
    { name: 'Journal entry',    icon: '📓', desc: 'Write your thoughts and reflections', xpReward: 15 },
    { name: 'Pray or meditate', icon: '🙏', desc: 'Spiritual or mindfulness practice',   xpReward: 15 },
    { name: 'Gratitude list',   icon: '🌸', desc: 'Write 3 things you are grateful for', xpReward: 10 },
    { name: 'No social media',  icon: '📵', desc: 'Digital detox for the day',           xpReward: 25 },
    { name: 'Call a loved one', icon: '📞', desc: 'Stay connected with family or friends',xpReward: 10 },
    { name: 'Self-care routine',icon: '✨', desc: 'Skincare, grooming, or relaxation',   xpReward: 10 },
  ],
  work: [
    { name: 'Deep work 2hrs',        icon: '🎯', desc: 'Focused work with no distractions',  xpReward: 30 },
    { name: 'Clear inbox',           icon: '📧', desc: 'Process all emails to zero',          xpReward: 15 },
    { name: 'Plan tomorrow',         icon: '📋', desc: 'Write tomorrows task list tonight',   xpReward: 10 },
    { name: 'Learn a work skill',    icon: '📈', desc: 'Improve a professional skill daily',  xpReward: 20 },
    { name: 'Review goals',          icon: '🏆', desc: 'Check progress on your goals',        xpReward: 10 },
    { name: 'No distractions 1hr',   icon: '🔕', desc: 'Phone off, full focus for an hour',   xpReward: 20 },
  ],
  other: [
    { name: 'Tidy up space',          icon: '🧹', desc: 'Keep your environment clean',        xpReward: 10 },
    { name: 'Save money',             icon: '💰', desc: 'Put aside a small amount daily',     xpReward: 15 },
    { name: 'Random act of kindness', icon: '💛', desc: 'Do something nice for someone',      xpReward: 15 },
    { name: 'Spend time outside',     icon: '🌳', desc: 'Get fresh air every day',            xpReward: 10 },
  ],
}

const habitExists = (name: string) => habits.value.some(h => h.name.toLowerCase() === name.toLowerCase())

const removingNames = ref<Set<string>>(new Set())

const visibleSuggestions = computed(() => {
  const cat = activeCategory.value
  if (!categorySuggestions[cat]) return []
  return categorySuggestions[cat].filter(s =>
    !habitExists(s.name) && !store.dismissedSuggestions.includes(s.name)
  )
})

const removedInCategory = computed(() =>
  activeCategory.value === 'all'
    ? removedHabits.value
    : removedHabits.value.filter(h => (h.category ?? 'other') === activeCategory.value)
)

const quickAdd = (s: { name: string; icon: string; xpReward: number }) => {
  removingNames.value = new Set([...removingNames.value, s.name])
  setTimeout(() => {
    store.addHabit({ name: s.name, icon: s.icon, xpReward: s.xpReward, color: 'amber', category: activeCategory.value as any })
    removingNames.value.delete(s.name)
  }, 350)
}

const removeHabit = (habit: { id: string; name: string }) => {
  store.deleteHabit(habit.id)
}

const filteredHabits = computed(() =>
  todayHabits.value.filter(h => activeCategory.value === 'all' || (h.category ?? 'other') === activeCategory.value)
)

const dragFrom = ref<number | null>(null)
const dragStart = (i: number) => { dragFrom.value = i }
const dragDrop = (i: number) => {
  if (dragFrom.value === null || dragFrom.value === i) return
  store.reorderHabits(dragFrom.value, i)
  dragFrom.value = null
}

const moods = [
  { value: 'great', emoji: '😄', label: 'Great' },
  { value: 'good',  emoji: '🙂', label: 'Good' },
  { value: 'okay',  emoji: '😐', label: 'Okay' },
  { value: 'bad',   emoji: '😔', label: 'Bad' },
]

const selectedMood = ref<'great' | 'good' | 'okay' | 'bad'>(todayEntry.value?.mood ?? 'good')
const journalText = ref(todayEntry.value?.content ?? '')
const noteSaved = ref(false)

watch(todayEntry, (entry) => {
  if (entry) {
    journalText.value = entry.content
    selectedMood.value = entry.mood
  }
})

const wasAllDone = ref(allDoneToday.value)

const toggle = (id: string) => {
  store.toggleHabit(id)
  if (allDoneToday.value && !wasAllDone.value) {
    fireConfetti()
  }
  wasAllDone.value = allDoneToday.value
}

const saveEntry = () => {
  if (!journalText.value.trim()) return
  store.saveJournalEntry(journalText.value, selectedMood.value)
  journalText.value = ''
  selectedMood.value = 'good'
  noteSaved.value = true
  setTimeout(() => { noteSaved.value = false }, 2500)
}

const showAddHabit = ref(false)
const newHabit = ref({ name: '', icon: '🎯', xpReward: 15, color: 'amber', category: 'health' as const })

const addHabit = () => {
  if (!newHabit.value.name.trim()) return
  store.addHabit(newHabit.value)
  newHabit.value = { name: '', icon: '🎯', xpReward: 15, color: 'amber', category: 'health' as const }
  showAddHabit.value = false
}
</script>
