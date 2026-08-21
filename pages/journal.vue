<template>
  <div class="max-w-2xl mx-auto">

    <div class="mb-8">
      <h1 class="text-3xl font-semibold text-stone-800 dark:text-stone-100 tracking-tight">Journal</h1>
      <p class="text-stone-400 mt-1 text-sm">{{ journal.length }} {{ journal.length === 1 ? 'entry' : 'entries' }}</p>
    </div>

    <!-- Write today's entry -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-stone-600 dark:text-stone-300">Today — {{ todayFormatted }}</h2>
        <div class="flex items-center gap-3">
          <button v-if="todayEntries.length" class="text-xs text-stone-400 hover:text-amber-500 transition-colors" @click="journalText = ''; selectedMood = 'good'">+ New entry</button>
          <div class="flex gap-1.5">
            <button
              v-for="m in moods"
              :key="m.value"
              class="text-lg transition-transform hover:scale-110"
              :class="selectedMood === m.value ? 'scale-125' : 'opacity-40'"
              @click="selectedMood = m.value"
              :title="m.label"
            >{{ m.emoji }}</button>
          </div>
        </div>
      </div>
      <textarea
        v-model="journalText"
        class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 dark:placeholder-stone-500 resize-none h-36"
        placeholder="Write freely — no rules, no judgment..."
      />
      <div class="flex justify-end mt-3">
        <button class="btn-primary" @click="save">Save +10 XP</button>
      </div>

      <!-- Today's saved entries -->
      <div v-if="todayEntries.length" class="mt-4 flex flex-col gap-2">
        <div v-for="entry in todayEntries" :key="entry.id" class="flex items-start justify-between gap-3 p-3 rounded-xl" style="background-color: var(--bg-app)">
          <p class="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2 flex-1">{{ entry.content }}</p>
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-sm">{{ moodEmoji(entry.mood) }}</span>
            <button class="text-xs text-stone-400 hover:text-amber-500" @click="startEdit(entry)">Edit</button>
            <button class="text-xs text-stone-400 hover:text-red-400" @click="deleteEntry(entry.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Past entries -->
    <div v-if="pastEntries.length" class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold text-stone-500 uppercase tracking-wide">Past Entries</h2>
        <input v-model="search" class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 w-40 text-sm py-1.5" placeholder="Search..." />
      </div>
      <div v-for="entry in filteredEntries" :key="entry.id" class="card dark:bg-stone-900 dark:border-stone-800 p-5 group hover:border-amber-200 dark:hover:border-amber-800 transition-colors">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-stone-600 dark:text-stone-300 cursor-pointer" @click="openEntry(entry)">{{ formatDate(entry.date) }}</span>
          <div class="flex items-center gap-2">
            <span class="text-lg">{{ moodEmoji(entry.mood) }}</span>
            <button class="text-xs text-stone-400 hover:text-amber-500 transition-all px-1" @click="startEdit(entry)">Edit</button>
            <button class="text-xs text-stone-400 hover:text-red-400 transition-all px-1" @click="deleteEntry(entry.id)">Delete</button>
          </div>
        </div>
        <p class="text-sm text-stone-500 leading-relaxed line-clamp-3 cursor-pointer" @click="openEntry(entry)">{{ entry.content }}</p>
      </div>
    </div>

    <div v-else-if="!pastEntries.length && !journal.length" class="text-center py-12 text-stone-300">
      <p class="text-4xl mb-3">📓</p>
      <p class="text-sm">Your story starts today — write your first entry above.</p>
    </div>

    <!-- Entry detail / edit modal -->
    <div v-if="selected" class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeModal">
      <div class="card dark:bg-stone-900 dark:border-stone-800 p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-semibold text-stone-600 dark:text-stone-300">{{ formatDate(selected.date) }}</span>
          <div class="flex items-center gap-3">
            <span class="text-xl">{{ moodEmoji(selected.mood) }}</span>
            <button class="text-stone-300 hover:text-stone-500" @click="closeModal">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <textarea v-if="editing" v-model="editText" class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 resize-none h-48 w-full mb-3" />
        <p v-else class="text-sm text-stone-700 dark:text-stone-200 leading-relaxed whitespace-pre-wrap">{{ selected.content }}</p>
        <div class="flex justify-end gap-2 mt-2">
          <template v-if="editing">
            <button class="btn-ghost" @click="editing = false">Cancel</button>
            <button class="btn-primary" @click="saveEdit">Save</button>
          </template>
          <button v-else class="btn-ghost text-sm" @click="editing = true">Edit</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useDayloomStore } from '~/stores/dayloom'
import { storeToRefs } from 'pinia'

const store = useDayloomStore()
const { journal, todayEntry } = storeToRefs(store)

const today = new Date().toISOString().split('T')[0]
const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

const moods = [
  { value: 'great', emoji: '😄', label: 'Great' },
  { value: 'good',  emoji: '🙂', label: 'Good' },
  { value: 'okay',  emoji: '😐', label: 'Okay' },
  { value: 'bad',   emoji: '😔', label: 'Bad' },
]

const selectedMood = ref<'great' | 'good' | 'okay' | 'bad'>('good')
const journalText = ref('')

const pastEntries = computed(() =>
  [...journal.value].filter(e => e.date !== today).sort((a, b) => b.date.localeCompare(a.date))
)

const todayEntries = computed(() =>
  journal.value.filter(e => e.date === today).sort((a, b) => a.id.localeCompare(b.id))
)

const search = ref('')
const selected = ref<typeof journal.value[0] | null>(null)
const editing = ref(false)
const editText = ref('')

const openEntry = (entry: typeof journal.value[0]) => {
  selected.value = entry
  editing.value = false
}

const startEdit = (entry: typeof journal.value[0]) => {
  selected.value = entry
  editText.value = entry.content
  editing.value = true
}

const closeModal = () => {
  selected.value = null
  editing.value = false
}

const saveEdit = () => {
  if (!selected.value || !editText.value.trim()) return
  store.editJournalEntry(selected.value.id, editText.value.trim())
  selected.value = { ...selected.value, content: editText.value.trim() }
  editing.value = false
}

const deleteEntry = (id: string) => {
  store.deleteJournalEntry(id)
  if (selected.value?.id === id) selected.value = null
}

const filteredEntries = computed(() =>
  pastEntries.value.filter(e =>
    !search.value || e.content.toLowerCase().includes(search.value.toLowerCase())
  )
)

const save = () => {
  if (!journalText.value.trim()) return
  store.addJournalEntry(journalText.value, selectedMood.value)
  journalText.value = ''
  selectedMood.value = 'good'
}

const moodEmoji = (mood: string) =>
  moods.find(m => m.value === mood)?.emoji ?? '🙂'

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
</script>
