<template>
  <main class="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12">
    <section class="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
      <NuxtLink to="/" class="text-sm font-semibold text-amber-600">UpStreak</NuxtLink>
      <h1 class="mt-6 text-2xl font-semibold text-stone-800">Welcome back</h1>
      <p class="mt-1 text-sm text-stone-500">Log in to keep your progress in sync.</p>

      <p v-if="!configured" class="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
        Sign-in is not set up yet. Add the Supabase project URL and publishable key to enable it.
      </p>
      <p v-if="message" class="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{{ message }}</p>
      <p v-if="errorMessage" class="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{{ errorMessage }}</p>

      <button
        class="btn-ghost mt-6 w-full border border-stone-200"
        type="button"
        :disabled="!configured || busy"
        @click="loginWithGoogle"
      >
        Continue with Google
      </button>
      <div class="my-5 flex items-center gap-3 text-xs text-stone-400">
        <span class="h-px flex-1 bg-stone-200" />
        or continue with email
        <span class="h-px flex-1 bg-stone-200" />
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="login">
        <label class="block text-sm font-medium text-stone-700">
          Email
          <input v-model="email" class="input mt-1 w-full" type="email" autocomplete="email" required />
        </label>
        <label class="block text-sm font-medium text-stone-700">
          Password
          <input v-model="password" class="input mt-1 w-full" type="password" autocomplete="current-password" required />
        </label>
        <div class="-mt-2 text-right">
          <NuxtLink to="/forgot-password" class="text-xs font-medium text-amber-600 hover:text-amber-700">
            Forgot password?
          </NuxtLink>
        </div>
        <button class="btn-primary w-full" type="submit" :disabled="!configured || busy">
          {{ busy ? 'Logging in…' : 'Log in' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-stone-500">
        New to UpStreak?
        <NuxtLink to="/register" class="font-medium text-amber-600 hover:text-amber-700">Create an account</NuxtLink>
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { isSupabaseConfigured, useSupabaseClient } from '~/composables/useSupabaseClient'

definePageMeta({ layout: false })

const configured = isSupabaseConfigured()
const email = ref('')
const password = ref('')
const busy = ref(false)
const message = ref('')
const errorMessage = ref('')

async function login() {
  if (!configured || busy.value) return
  busy.value = true
  errorMessage.value = ''

  try {
    const { error } = await useSupabaseClient().auth.signInWithPassword({
      email: email.value.trim(),
      password: password.value,
    })
    if (error) throw error
    await navigateTo('/')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to log in. Please try again.'
  } finally {
    busy.value = false
  }
}

async function loginWithGoogle() {
  if (!configured || busy.value) return
  busy.value = true
  errorMessage.value = ''

  try {
    const { error } = await useSupabaseClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to continue with Google. Please try again.'
  } finally {
    busy.value = false
  }
}

onMounted(() => {
  if (new URLSearchParams(window.location.search).get('registered') === '1') {
    message.value = 'Account created. Check your email to confirm your address, then log in.'
  }
})
</script>
