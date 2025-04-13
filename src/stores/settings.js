import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  const taskPriorities = ref({
    1: {
      title: 'Низкий',
      class: 'stroke-blue-400',
      activeClass: 'text-blue-400',
    },
    2: {
      title: 'Средний',
      class: 'stroke-yellow-400',
      activeClass: 'text-yellow-400',
    },
    3: {
      title: 'Высокий',
      class: 'stroke-red-400',
      activeClass: 'text-red-400',
    },
  })

  return { taskPriorities }
})
