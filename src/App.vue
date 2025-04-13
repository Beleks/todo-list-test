<script setup>
import { useRouter } from 'vue-router'

const menuItems = [
  { title: 'Список задач', routeName: 'taskList' },
  { title: 'Настройки', routeName: 'settings' },
  { title: 'О проекте', routeName: 'about' },
]
</script>

<template>
  <div class="flex justify-center gap-6 text-gray-400">
    <RouterLink
      replace
      v-for="item in menuItems"
      :to="{ name: item.routeName }"
      class="font-sans font-medium"
      activeClass="text-gray-50"
    >
      {{ item.title }}
    </RouterLink>
  </div>

  <RouterView />
</template>

<style scoped>
@media (min-width: 1024px) {
}
</style>
