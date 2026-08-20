<template>
  <div
    class="flex items-center gap-3 p-3 rounded-xl border transition-all"
    :class="achievement.unlockedAt
      ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800'
      : 'border-stone-100 bg-stone-50 dark:bg-stone-800 dark:border-stone-700 opacity-50'"
  >
    <div
      class="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
      :class="achievement.unlockedAt ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-stone-100 dark:bg-stone-700'"
    >
      {{ achievement.icon }}
    </div>
    <div class="min-w-0">
      <p class="text-sm font-semibold text-stone-800 dark:text-stone-100">{{ achievement.title }}</p>
      <p class="text-xs text-stone-400 dark:text-stone-500 truncate">{{ achievement.description }}</p>
      <p v-if="achievement.unlockedAt" class="text-xs text-amber-500 mt-0.5">
        Unlocked {{ formatDate(achievement.unlockedAt) }}
      </p>
    </div>
    <div v-if="achievement.unlockedAt" class="ml-auto shrink-0">
      <span class="text-amber-400 text-lg">✓</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Achievement } from '~/stores/dayloom'

defineProps<{ achievement: Achievement }>()

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
</script>
