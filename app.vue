<script setup lang="ts">
useHead({
  meta: [
    { "http-equiv": 'Permissions-Policy', content: 'interest-cohort=()' }
  ],
  link: [
    { rel: 'canonical', href: 'https://linpolly.github.io/' }
  ]
})
</script>

<template>
  <ClientOnly>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ClientOnly>
</template>

<style>
html {
  overflow-y: auto !important;
}

html,
body {
  padding: 0;
  margin: 0;
}

::-webkit-scrollbar {
  width: 0.45rem;
  height: 0.45rem;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(27, 27, 27, 0.4);
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: transparent;
}
</style>