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

      <div class="flex flex-col gap-3">
        <div
          v-for="habit in todayHabits"
          :key="habit.id"
          class="card dark:bg-stone-900 dark:border-stone-800 p-4 flex items-center gap-4 transition-all duration-150 group"
          :class="habit.doneToday ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900' : ''"
        >
          <button class="flex items-center gap-4 flex-1 text-left" @click="toggle(habit.id)">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              :class="habit.doneToday ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-stone-100 dark:bg-stone-800'"
            >{{ habit.icon }}</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-stone-800 dark:text-stone-100" :class="habit.doneToday ? 'line-through text-stone-400' : ''">
                {{ habit.name }}
              </p>
              <p class="text-xs text-stone-400 mt-0.5">🔥 {{ habit.streak }} day streak · +{{ habit.xpReward }} XP</p>
            </div>
            <div
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
              :class="habit.doneToday ? 'bg-amber-400 border-amber-400' : 'border-stone-200 dark:border-stone-600'"
            >
              <svg v-if="habit.doneToday" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </button>
          <button
            class="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 dark:text-stone-600 dark:hover:text-red-400 transition-all ml-1 p-1 rounded-lg"
            @click="store.deleteHabit(habit.id)"
            title="Delete habit"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
      <div class="flex justify-end mt-3">
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
        </div>
        <div class="flex gap-2 mt-5 justify-end">
          <button class="btn-ghost" @click="showAddHabit = false">Cancel</button>
          <button class="btn-primary" @click="addHabit">Add Habit</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useDayloomStore } from '~/stores/dayloom'
import { storeToRefs } from 'pinia'

const store = useDayloomStore()
const { todayHabits, completedToday, habits, todayEntry, allDoneToday } = storeToRefs(store)
const { fire: fireConfetti } = useConfetti()

const now = new Date()
const hour = now.getHours()
const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
const formattedDate = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

const moods = [
  { value: 'great', emoji: '😄', label: 'Great' },
  { value: 'good',  emoji: '🙂', label: 'Good' },
  { value: 'okay',  emoji: '😐', label: 'Okay' },
  { value: 'bad',   emoji: '😔', label: 'Bad' },
]

const selectedMood = ref<'great' | 'good' | 'okay' | 'bad'>('good')
const journalText = ref(todayEntry.value?.content ?? '')

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
}

const showAddHabit = ref(false)
const newHabit = ref({ name: '', icon: '🎯', xpReward: 15, color: 'amber' })

const addHabit = () => {
  if (!newHabit.value.name.trim()) return
  store.addHabit(newHabit.value)
  newHabit.value = { name: '', icon: '🎯', xpReward: 15, color: 'amber' }
  showAddHabit.value = false
}
</script>
