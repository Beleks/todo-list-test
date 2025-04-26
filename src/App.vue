<script setup>
import { RouterLink } from 'vue-router'

const menuItems = [
  { title: 'taskList', routeName: 'taskList' },
  { title: 'settings', routeName: 'settings' },
  { title: 'aboutProject', routeName: 'about' },
]
</script>

<template>
  <div class="p-2 md:p-5">
    <div class="flex justify-around lg:justify-center sm:gap-6 text-gray-400">
      <RouterLink
        replace
        v-for="item in menuItems"
        :to="{ name: item.routeName }"
        class="font-sans font-medium"
        activeClass="text-purple-400"
      >
        {{ $t(item.title) }}
      </RouterLink>
    </div>

    <RouterView />
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
}
</style>
