<template>
  <main class="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12">
    <section class="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
      <NuxtLink to="/login" class="text-sm font-semibold text-amber-600">UpStreak</NuxtLink>
      <h1 class="mt-6 text-2xl font-semibold text-stone-800">Reset your password</h1>
      <p class="mt-1 text-sm text-stone-500">We’ll email you a secure link to choose a new password.</p>

      <p v-if="message" class="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{{ message }}</p>
      <p v-if="errorMessage" class="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{{ errorMessage }}</p>

      <form class="mt-6 space-y-4" @submit.prevent="sendResetLink">
        <label class="block text-sm font-medium text-stone-700">
          Email
          <input v-model="email" class="input mt-1 w-full" type="email" autocomplete="email" required />
        </label>
        <button class="btn-primary w-full" type="submit" :disabled="!configured || busy">
          {{ busy ? 'Sending…' : 'Send reset link' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-stone-500">
        <NuxtLink to="/login" class="font-medium text-amber-600 hover:text-amber-700">Back to log in</NuxtLink>
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { isSupabaseConfigured, useSupabaseClient } from '~/composables/useSupabaseClient'

definePageMeta({ layout: false })

const configured = isSupabaseConfigured()
const email = ref('')
const busy = ref(false)
const message = ref('')
const errorMessage = ref('')

async function sendResetLink() {
  if (!configured || busy.value) return
  busy.value = true
  errorMessage.value = ''
  message.value = ''

  try {
    const { error } = await useSupabaseClient().auth.resetPasswordForEmail(email.value.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
    message.value = 'If an account exists for that email, a password reset link is on its way.'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to send a reset link. Please try again.'
  } finally {
    busy.value = false
  }
}
</script>
