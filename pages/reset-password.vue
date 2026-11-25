<template>
  <main class="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12">
    <section class="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
      <NuxtLink to="/login" class="text-sm font-semibold text-amber-600">UpStreak</NuxtLink>
      <h1 class="mt-6 text-2xl font-semibold text-stone-800">Choose a new password</h1>
      <p class="mt-1 text-sm text-stone-500">Use at least 8 characters.</p>

      <p v-if="message" class="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{{ message }}</p>
      <p v-if="errorMessage" class="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{{ errorMessage }}</p>

      <form v-if="sessionReady && !message" class="mt-6 space-y-4" @submit.prevent="updatePassword">
        <label class="block text-sm font-medium text-stone-700">
          New password
          <input v-model="password" class="input mt-1 w-full" type="password" autocomplete="new-password" minlength="8" required />
        </label>
        <label class="block text-sm font-medium text-stone-700">
          Confirm new password
          <input v-model="confirmPassword" class="input mt-1 w-full" type="password" autocomplete="new-password" minlength="8" required />
        </label>
        <button class="btn-primary w-full" type="submit" :disabled="busy">
          {{ busy ? 'Updating…' : 'Update password' }}
        </button>
      </form>
      <p v-else-if="checkingSession" class="mt-6 text-sm text-stone-500">Checking your reset link…</p>
      <NuxtLink v-else to="/forgot-password" class="btn-primary mt-6 block text-center">
        Request another reset link
      </NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useSupabaseClient } from '~/composables/useSupabaseClient'

definePageMeta({ layout: false })

const password = ref('')
const confirmPassword = ref('')
const sessionReady = ref(false)
const checkingSession = ref(true)
const busy = ref(false)
const message = ref('')
const errorMessage = ref('')

onMounted(async () => {
  try {
    const { data, error } = await useSupabaseClient().auth.getSession()
    if (error) throw error
    sessionReady.value = Boolean(data.session)
    if (!data.session) errorMessage.value = 'This reset link is invalid or has expired.'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to verify your reset link.'
  } finally {
    checkingSession.value = false
  }
})

async function updatePassword() {
  if (busy.value || !sessionReady.value) return
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'The passwords do not match.'
    return
  }

  busy.value = true
  errorMessage.value = ''

  try {
    const { error } = await useSupabaseClient().auth.updateUser({ password: password.value })
    if (error) throw error
    message.value = 'Your password has been updated. Taking you to UpStreak…'
    await navigateTo('/')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to update your password. Please try again.'
  } finally {
    busy.value = false
  }
}
</script>
