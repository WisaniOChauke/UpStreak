<template>
  <div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white dark:bg-stone-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-stone-100 dark:border-stone-800 shadow-xl overflow-hidden" style="background-color: var(--bg-card); border-color: var(--border)">

      <!-- Header -->
      <div class="flex items-center gap-4 p-5 border-b" style="border-color: var(--border)">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style="background-color: var(--accent-light)">
          {{ habit.icon }}
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="text-base font-semibold truncate" style="color: var(--text-primary)">{{ habit.name }}</h2>
          <p class="text-xs capitalize mt-0.5" style="color: var(--text-subtle)">{{ habit.category ?? 'other' }} · +{{ habit.xpReward }} XP</p>
        </div>
        <button class="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors" style="color: var(--text-muted)" @click="$emit('close')">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b" style="border-color: var(--border)">
        <button
          v-for="tab in tabs" :key="tab"
          class="flex-1 py-3 text-xs font-semibold uppercase tracking-wide transition-colors"
          :style="activeTab === tab
            ? { color: 'var(--accent)', borderBottom: '2px solid var(--accent)' }
            : { color: 'var(--text-muted)' }"
          @click="activeTab = tab"
        >{{ tab }}</button>
      </div>

      <!-- Tab: Quick Log -->
      <div v-if="activeTab === 'Log'" class="p-5">
        <!-- Toggle today -->
        <button
          class="w-full flex items-center justify-between p-4 rounded-2xl border-2 mb-5 transition-all"
          :style="doneToday
            ? { borderColor: 'var(--accent)', backgroundColor: 'var(--accent)', opacity: '0.85' }
            : { borderColor: 'var(--border)', backgroundColor: 'var(--bg-app)' }"
          @click="$emit('toggle', habit.id)"
        >
          <span class="text-sm font-medium" :style="doneToday ? { color: '#fff' } : { color: 'var(--text-primary)' }">{{ doneToday ? '✅ Done today!' : 'Mark as done today' }}</span>
          <div class="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all"
            :style="doneToday ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' } : { borderColor: 'var(--border)' }">
            <svg v-if="doneToday" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
        </button>

        <!-- Last 30 days mini calendar -->
        <p class="text-xs font-semibold uppercase tracking-wide mb-3" style="color: var(--text-muted)">Last 30 days</p>
        <div class="flex flex-wrap gap-1.5">
          <div
            v-for="day in last30" :key="day.date"
            class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-colors"
            :style="day.done
              ? { backgroundColor: 'var(--accent)', color: '#fff' }
              : { backgroundColor: 'var(--border)', color: 'var(--text-muted)' }"
            :title="day.date"
          >{{ day.label }}</div>
        </div>

        <!-- Notes -->
        <p class="text-xs font-semibold uppercase tracking-wide mt-5 mb-2" style="color: var(--text-muted)">Notes</p>
        <textarea
          v-model="notesInput"
          class="input resize-none h-20 text-sm"
          placeholder="Any notes for this habit..."
          @blur="saveNotes"
        />
      </div>

      <!-- Tab: Stats -->
      <div v-else-if="activeTab === 'Stats'" class="p-5">
        <div class="grid grid-cols-3 gap-3 mb-5">
          <div class="rounded-2xl p-4 text-center" style="background-color: var(--accent-light)">
            <p class="text-2xl font-bold" style="color: var(--accent)">{{ habit.streak }}</p>
            <p class="text-xs mt-0.5" style="color: var(--text-muted)">Current streak</p>
          </div>
          <div class="rounded-2xl p-4 text-center" style="background-color: var(--bg-app)">
            <p class="text-2xl font-bold" style="color: var(--text-primary)">{{ habit.bestStreak ?? habit.streak }}</p>
            <p class="text-xs mt-0.5" style="color: var(--text-muted)">Best streak</p>
          </div>
          <div class="rounded-2xl p-4 text-center" style="background-color: var(--bg-app)">
            <p class="text-2xl font-bold" style="color: var(--text-primary)">{{ habit.completedDates.length }}</p>
            <p class="text-xs mt-0.5" style="color: var(--text-muted)">Total done</p>
          </div>
        </div>

        <!-- Completion rate this week -->
        <p class="text-xs font-semibold uppercase tracking-wide mb-3" style="color: var(--text-muted)">This week</p>
        <div class="flex items-end gap-1.5 h-16 mb-1">
          <div v-for="day in last7" :key="day.date" class="flex-1 flex flex-col items-center gap-1">
            <div class="w-full rounded-md transition-all" :style="{ height: '40px', backgroundColor: day.done ? 'var(--accent)' : 'var(--border)' }" />
            <span class="text-xs" style="color: var(--text-muted)">{{ day.label }}</span>
          </div>
        </div>

        <!-- XP earned -->
        <div class="mt-5 p-4 rounded-2xl flex items-center justify-between" style="background-color: var(--bg-app)">
          <span class="text-sm" style="color: var(--text-muted)">Total XP earned</span>
          <span class="text-sm font-bold" style="color: var(--accent)">+{{ habit.completedDates.length * habit.xpReward }} XP</span>
        </div>
      </div>

      <!-- Tab: Edit -->
      <div v-else-if="activeTab === 'Edit'" class="p-5 flex flex-col gap-3">
        <div class="flex gap-3">
          <input v-model="edit.icon" class="input w-16 text-center text-2xl" maxlength="2" />
          <input v-model="edit.name" class="input flex-1" placeholder="Habit name" />
        </div>
        <select v-model="edit.category" class="input">
          <option value="health">💧 Health</option>
          <option value="fitness">🏋️ Fitness</option>
          <option value="learning">📖 Learning</option>
          <option value="work">💼 Work</option>
          <option value="personal">🌟 Personal</option>
          <option value="other">📦 Other</option>
        </select>
        <input v-model.number="edit.xpReward" type="number" class="input" placeholder="XP reward" />
        <textarea v-model="edit.notes" class="input resize-none h-20" placeholder="Notes..." />
        <div class="flex gap-2 pt-1">
          <button class="btn-primary flex-1" @click="saveEdit">Save changes</button>
          <button class="btn-ghost text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" @click="$emit('delete', habit.id); $emit('close')">Delete</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useDayloomStore } from '~/stores/dayloom'
import type { Habit, HabitCategory } from '~/stores/dayloom'

const props = defineProps<{ habit: Habit & { doneToday: boolean } }>()
const emit = defineEmits<{ close: []; toggle: [id: string]; delete: [id: string] }>()

const store = useDayloomStore()
const tabs = ['Log', 'Stats', 'Edit'] as const
const activeTab = ref<'Log' | 'Stats' | 'Edit'>('Log')

const doneToday = computed(() => {
  const t = new Date().toISOString().split('T')[0]
  return store.habits.find(h => h.id === props.habit.id)?.completedDates.includes(t) ?? false
})
const notesInput = ref(props.habit.notes ?? '')
const saveNotes = () => store.updateHabit(props.habit.id, { notes: notesInput.value })

const edit = ref({
  name: props.habit.name,
  icon: props.habit.icon,
  category: props.habit.category ?? 'other' as HabitCategory,
  xpReward: props.habit.xpReward,
  notes: props.habit.notes ?? '',
})

const saveEdit = () => {
  store.updateHabit(props.habit.id, edit.value)
  emit('close')
}

const last30 = computed(() => {
  const completedDates = store.habits.find(h => h.id === props.habit.id)?.completedDates ?? []
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    const date = d.toISOString().split('T')[0]
    return { date, done: completedDates.includes(date), label: d.getDate().toString() }
  })
})

const last7 = computed(() => {
  const completedDates = store.habits.find(h => h.id === props.habit.id)?.completedDates ?? []
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const date = d.toISOString().split('T')[0]
    return { date, done: completedDates.includes(date), label: d.toLocaleDateString('en-US', { weekday: 'short' }) }
  })
})
</script>
