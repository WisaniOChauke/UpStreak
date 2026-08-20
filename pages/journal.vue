<template>
  <div class="max-w-2xl mx-auto">

    <div class="mb-8">
      <h1 class="text-3xl font-semibold text-stone-800 dark:text-stone-100 tracking-tight">Journal</h1>
      <p class="text-stone-400 mt-1 text-sm">{{ journal.length }} entries</p>
    </div>

    <!-- Write today's entry -->
    <div class="card dark:bg-stone-900 dark:border-stone-800 p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-stone-600 dark:text-stone-300">Today — {{ todayFormatted }}</h2>
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
      <textarea
        v-model="journalText"
        class="input dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 dark:placeholder-stone-500 resize-none h-36"
        placeholder="Write freely — no rules, no judgment..."
      />
      <div class="flex justify-end mt-3">
        <button class="btn-primary" @click="save">Save +10 XP</button>
      </div>
    </div>

    <!-- Past entries -->
    <div v-if="pastEntries.length" class="flex flex-col gap-4">
      <h2 class="text-sm font-semibold text-stone-500 uppercase tracking-wide">Past Entries</h2>
      <div v-for="entry in pastEntries" :key="entry.id" class="card dark:bg-stone-900 dark:border-stone-800 p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-stone-600 dark:text-stone-300">{{ formatDate(entry.date) }}</span>
          <span class="text-lg">{{ moodEmoji(entry.mood) }}</span>
        </div>
        <p class="text-sm text-stone-500 leading-relaxed line-clamp-3">{{ entry.content }}</p>
      </div>
    </div>

    <div v-else class="text-center py-12 text-stone-300">
      <p class="text-4xl mb-3">📓</p>
      <p class="text-sm">No past entries yet. Start writing!</p>
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

const selectedMood = ref<'great' | 'good' | 'okay' | 'bad'>(todayEntry.value?.mood ?? 'good')
const journalText = ref(todayEntry.value?.content ?? '')

const pastEntries = computed(() =>
  [...journal.value].filter(e => e.date !== today).sort((a, b) => b.date.localeCompare(a.date))
)

const save = () => {
  if (!journalText.value.trim()) return
  store.saveJournalEntry(journalText.value, selectedMood.value)
}

const moodEmoji = (mood: string) =>
  moods.find(m => m.value === mood)?.emoji ?? '🙂'

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
</script>
