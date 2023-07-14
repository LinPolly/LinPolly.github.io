<script setup lang="ts">
useHead({
  meta: [
    { "http-equiv": 'Permissions-Policy', content: 'interest-cohort=()' }
  ],
  link: [
    { rel: 'canonical', href: 'https://linpolly.netlify.app/' }
  ]
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
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
  background-color: 'white';
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: transparent;
}
</style>