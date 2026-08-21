<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const router = useRouter()
onMounted(() => router.replace('/'))
</script>
