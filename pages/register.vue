<template>
  <main class="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12">
    <section class="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
      <NuxtLink to="/" class="text-sm font-semibold text-amber-600">UpStreak</NuxtLink>
      <h1 class="mt-6 text-2xl font-semibold text-stone-800">Create your account</h1>
      <p class="mt-1 text-sm text-stone-500">Your habits and progress will be saved to your account.</p>

      <p v-if="!configured" class="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
        Sign-up is not set up yet. Add the Supabase project URL and publishable key to enable it.
      </p>
      <p v-if="message" class="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{{ message }}</p>
      <p v-if="errorMessage" class="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{{ errorMessage }}</p>

      <button
        class="btn-ghost mt-6 w-full border border-stone-200"
        type="button"
        :disabled="!configured || busy"
        @click="registerWithGoogle"
      >
        Continue with Google
      </button>
      <div class="my-5 flex items-center gap-3 text-xs text-stone-400">
        <span class="h-px flex-1 bg-stone-200" />
        or sign up with email
        <span class="h-px flex-1 bg-stone-200" />
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="register">
        <label class="block text-sm font-medium text-stone-700">
          Email
          <input v-model="email" class="input mt-1 w-full" type="email" autocomplete="email" required />
        </label>
        <label class="block text-sm font-medium text-stone-700">
          Password
          <input v-model="password" class="input mt-1 w-full" type="password" autocomplete="new-password" minlength="8" required />
        </label>
        <button class="btn-primary w-full" type="submit" :disabled="!configured || busy">
          {{ busy ? 'Creating account…' : 'Create account' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-stone-500">
        Already have an account?
        <NuxtLink to="/login" class="font-medium text-amber-600 hover:text-amber-700">Log in</NuxtLink>
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

async function register() {
  if (!configured || busy.value) return
  busy.value = true
  errorMessage.value = ''
  message.value = ''

  try {
    const { data, error } = await useSupabaseClient().auth.signUp({
      email: email.value.trim(),
      password: password.value,
    })
    if (error) throw error

    if (data.session) {
      await navigateTo('/')
    } else {
      await navigateTo('/login?registered=1')
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to create your account. Please try again.'
  } finally {
    busy.value = false
  }
}

async function registerWithGoogle() {
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
</script>
