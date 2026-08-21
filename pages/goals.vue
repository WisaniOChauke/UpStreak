<template>
  <div class="max-w-2xl mx-auto">

    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-semibold text-stone-800 dark:text-stone-100 tracking-tight">Goals</h1>
          <p class="text-stone-400 mt-1 text-sm">{{ activeGoals.length }} active · {{ completedGoals.length }} completed</p>
        </div>
        <button class="btn-primary" @click="showAddGoal = true">+ New goal</button>
      </div>
    </div>

    <!-- Active Goals -->
    <div class="flex flex-col gap-5 mb-8">
      <div v-for="goal in activeGoals" :key="goal.id" class="card dark:bg-stone-900 dark:border-stone-800 p-6 group">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-base font-semibold text-stone-800 dark:text-stone-100">{{ goal.title }}</h3>
            <p class="text-sm text-stone-400 mt-0.5">{{ goal.description }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="badge bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-xs">Due {{ formatDate(goal.dueDate) }}</span>
            <button
              class="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 dark:text-stone-600 dark:hover:text-red-400 transition-all p-1 rounded-lg"
              @click="store.deleteGoal(goal.id)"
              title="Delete goal"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div class="mb-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-stone-500 dark:text-stone-400 font-medium">{{ goal.progress }} / {{ goal.target }} {{ goal.unit }}</span>
            <span class="text-amber-500 font-semibold">{{ Math.round((goal.progress / goal.target) * 100) }}%</span>
          </div>
          <div class="w-full bg-stone-100 dark:bg-stone-700 rounded-full h-2">
            <div class="bg-amber-400 h-2 rounded-full transition-all duration-500" :style="{ width: ((goal.progress / goal.target) * 100) + '%' }" />
          </div>
        </div>

        <div class="flex flex-col gap-2 mb-4">
          <div v-for="(ms, i) in goal.milestones" :key="i" class="flex items-center gap-3 text-sm">
            <div
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
              :class="ms.done ? 'bg-amber-400 border-amber-400' : 'border-stone-200 dark:border-stone-600'"
            >
              <svg v-if="ms.done" class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span :class="ms.done ? 'line-through text-stone-400' : 'text-stone-600 dark:text-stone-300'">{{ ms.label }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
          <input
            v-model.number="progressInputs[goal.id]"
            type="number"
            class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 w-28"
            :placeholder="`Current ${goal.unit}`"
            :max="goal.target"
            :min="0"
          />
          <button class="btn-primary" @click="updateProgress(goal.id)">Update</button>
          <button class="btn-ghost dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800 ml-auto" @click="complete(goal.id)">
            Mark complete ✓
          </button>
        </div>
      </div>
    </div>

    <!-- Completed Goals -->
    <div v-if="completedGoals.length">
      <h2 class="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4">Completed 🎉</h2>
      <div class="flex flex-col gap-3">
        <div v-for="goal in completedGoals" :key="goal.id" class="card dark:bg-stone-900 dark:border-stone-800 p-4 flex items-center gap-4 opacity-70">
          <div class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 shrink-0">✓</div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-stone-700 dark:text-stone-300 line-through">{{ goal.title }}</p>
            <p class="text-xs text-stone-400">{{ goal.target }} {{ goal.unit }} · +100 XP earned</p>
          </div>
          <button class="text-stone-300 hover:text-red-400 dark:text-stone-600 dark:hover:text-red-400 transition-colors p-1" @click="store.deleteGoal(goal.id)">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!activeGoals.length && !completedGoals.length" class="text-center py-16 text-stone-300">
      <p class="text-5xl mb-3">🎯</p>
      <p class="text-sm mb-4">No goals yet. Set your first one!</p>
      <button class="btn-primary" @click="showAddGoal = true">+ New goal</button>
    </div>

    <!-- Goal suggestions -->
    <div v-if="!activeGoals.length" class="mt-2">
      <p class="text-xs font-semibold uppercase tracking-wide mb-3" style="color: var(--text-muted)">✨ Need inspiration?</p>
      <div class="grid grid-cols-1 gap-2">
        <button
          v-for="s in goalSuggestions" :key="s.title"
          class="flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:border-amber-300 dark:hover:border-amber-700"
          style="border-color: var(--border); background-color: var(--bg-card)"
          @click="prefill(s)"
        >
          <span class="text-xl shrink-0">{{ s.icon }}</span>
          <div>
            <p class="text-sm font-medium" style="color: var(--text-primary)">{{ s.title }}</p>
            <p class="text-xs" style="color: var(--text-muted)">{{ s.description }}</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Add Goal Modal -->
    <div v-if="showAddGoal" class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showAddGoal = false">
      <div class="card dark:bg-stone-900 dark:border-stone-800 p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-base font-semibold text-stone-800 dark:text-stone-100 mb-4">New Goal</h3>
        <div class="flex flex-col gap-3">
          <input v-model="newGoal.title" class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100" placeholder="Goal title" />
          <textarea v-model="newGoal.description" class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 resize-none h-20" placeholder="Description (optional)" />
          <div class="flex gap-3">
            <input v-model.number="newGoal.target" type="number" class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100" placeholder="Target (e.g. 10)" />
            <input v-model="newGoal.unit" class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100" placeholder="Unit (e.g. books)" />
          </div>
          <input v-model="newGoal.dueDate" type="date" class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100" />

          <!-- Milestones -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-stone-500 dark:text-stone-400">Milestones</span>
              <button class="text-xs text-amber-500 hover:text-amber-600" @click="newGoal.milestones.push({ label: '', done: false })">+ Add</button>
            </div>
            <div class="flex flex-col gap-2">
              <div v-for="(ms, i) in newGoal.milestones" :key="i" class="flex gap-2">
                <input v-model="ms.label" class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 flex-1" :placeholder="`Milestone ${i + 1}`" />
                <button class="text-stone-300 hover:text-red-400 px-2" @click="newGoal.milestones.splice(i, 1)">✕</button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex gap-2 mt-5 justify-end">
          <button class="btn-ghost" @click="showAddGoal = false">Cancel</button>
          <button class="btn-primary" @click="addGoal">Add Goal</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useDayloomStore } from '~/stores/dayloom'
import { storeToRefs } from 'pinia'

const store = useDayloomStore()
const { goals } = storeToRefs(store)
const { fire: fireConfetti } = useConfetti()

const activeGoals = computed(() => goals.value.filter(g => !g.completed))
const completedGoals = computed(() => goals.value.filter(g => g.completed))

const progressInputs = ref<Record<string, number>>({})

const updateProgress = (id: string) => {
  const val = progressInputs.value[id]
  if (val !== undefined) store.updateGoalProgress(id, val)
}

const complete = (id: string) => {
  store.completeGoal(id)
  fireConfetti()
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const showAddGoal = ref(false)
const newGoal = ref({ title: '', description: '', target: 1, unit: '', dueDate: '', color: 'amber', milestones: [{ label: '', done: false }] })

const goalSuggestions = [
  { icon: '📚', title: 'Read 12 books',        description: 'One book per month this year',         target: 12,  unit: 'books',    milestones: ['Read 3 books', 'Read 6 books', 'Read 9 books', 'Read 12 books'] },
  { icon: '🏃', title: 'Run 100km',             description: 'Build up your running distance',        target: 100, unit: 'km',       milestones: ['Run 25km', 'Run 50km', 'Run 75km', 'Run 100km'] },
  { icon: '💰', title: 'Save R10,000',          description: 'Build an emergency fund',               target: 10000, unit: 'rand',   milestones: ['Save R2,500', 'Save R5,000', 'Save R7,500', 'Save R10,000'] },
  { icon: '💪', title: 'Do 1000 pushups',       description: 'Spread across the month',               target: 1000, unit: 'pushups', milestones: ['250 pushups', '500 pushups', '750 pushups', '1000 pushups'] },
  { icon: '🧘', title: 'Meditate 30 days',      description: 'Build a daily mindfulness habit',       target: 30,  unit: 'days',     milestones: ['7 days', '14 days', '21 days', '30 days'] },
  { icon: '✍️', title: 'Write 10 journal entries', description: 'Reflect on your week regularly',    target: 10,  unit: 'entries',  milestones: ['3 entries', '5 entries', '8 entries', '10 entries'] },
  { icon: '🎓', title: 'Complete an online course', description: 'Learn a new skill end to end',     target: 100, unit: '%',        milestones: ['25% done', '50% done', '75% done', 'Completed'] },
  { icon: '🌍', title: 'Learn 100 new words',   description: 'In any language you are learning',     target: 100, unit: 'words',    milestones: ['25 words', '50 words', '75 words', '100 words'] },
]

const prefill = (s: typeof goalSuggestions[0]) => {
  newGoal.value = {
    title: s.title,
    description: s.description,
    target: s.target,
    unit: s.unit,
    dueDate: '',
    color: 'amber',
    milestones: s.milestones.map(label => ({ label, done: false })),
  }
  showAddGoal.value = true
}

const addGoal = () => {
  if (!newGoal.value.title.trim() || !newGoal.value.target || !newGoal.value.unit.trim()) return
  store.addGoal({
    ...newGoal.value,
    milestones: newGoal.value.milestones.filter(m => m.label.trim()),
  })
  newGoal.value = { title: '', description: '', target: 1, unit: '', dueDate: '', color: 'amber', milestones: [{ label: '', done: false }] }
  showAddGoal.value = false
}
</script>
