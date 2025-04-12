<script setup>
import {RouterLink, RouterView, useRouter} from 'vue-router'

const menuItems = ['taskList', 'settings', 'about']
const router = useRouter()

function choosePage(item) {
  router.replace({name: item})
}
</script>

<template>
  <div class="flex justify-center gap-6">
    <div v-for="item in menuItems" @click="choosePage(item)">
      {{ item }}
    </div>
  </div>

  <RouterView />
</template>

<style scoped>

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
